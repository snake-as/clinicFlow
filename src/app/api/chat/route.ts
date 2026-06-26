import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { supabaseAdmin } from "@/lib/supabase/server";
import type { Clinic, ChatMessage } from "@/types";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ── Tool definition ───────────────────────────────────────────────────────────

const CREATE_BOOKING_TOOL: OpenAI.Chat.ChatCompletionTool = {
  type: "function",
  function: {
    name: "create_booking",
    description:
      "Book an appointment for a patient. Call this once you have collected the patient's full name, chosen service, preferred date/time, and contact (phone or email).",
    parameters: {
      type: "object",
      properties: {
        patient_name: { type: "string", description: "Full name of the patient" },
        service: { type: "string", description: "Exact service name as listed in the clinic menu" },
        starts_at: {
          type: "string",
          description: "ISO 8601 datetime for the appointment, e.g. 2025-07-15T10:30:00",
        },
        patient_contact: {
          type: "string",
          description: "Patient's phone number or email address",
        },
        raw_notes: {
          type: "string",
          description: "Any extra notes from the conversation (optional)",
        },
      },
      required: ["patient_name", "service", "starts_at", "patient_contact"],
    },
  },
};

// ── System prompt factory ─────────────────────────────────────────────────────

function buildSystemPrompt(clinic: Clinic): string {
  const serviceList = clinic.services
    .map((s) => `- ${s.name}: €${s.price}, ${s.duration} min. ${s.description ?? ""}`)
    .join("\n");

  const hoursList = Object.entries(clinic.hours)
    .map(([day, slot]) => `- ${day}: ${slot ? `${slot.open}–${slot.close}` : "Closed"}`)
    .join("\n");

  return `You are the AI receptionist for ${clinic.name}, a premium aesthetic clinic located at ${clinic.location}. Your name is Aurora.

Your role is to warmly greet patients, answer questions about services, prices, and opening hours, and guide patients through booking an appointment.

CLINIC INFORMATION
------------------
Phone: ${clinic.phone}
Location: ${clinic.location}

Services & Prices:
${serviceList}

Opening Hours:
${hoursList}

BOOKING FLOW
------------
To book an appointment, collect these four things — one at a time, naturally in conversation:
1. Patient's full name
2. Which service they'd like
3. Preferred date and time (must be during opening hours)
4. Contact details (phone number or email)

Once you have all four, call the create_booking function immediately. Do not ask for confirmation first — just book it. After the function returns success, confirm the booking details warmly to the patient.

BEHAVIOUR RULES
---------------
- Be warm, professional, and concise. No long paragraphs.
- Only answer questions about ${clinic.name}. Politely decline anything unrelated.
- If asked about a service not on the menu, say it isn't offered and suggest the closest alternative.
- Never invent prices, hours, or services. Only use what is listed above.
- Today's date context: the user is likely booking for the near future. If they say "next Tuesday", interpret it relative to today.
- If a requested time is outside opening hours, politely say so and suggest an available slot.`;
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const { messages }: { messages: ChatMessage[] } = await req.json();

    if (!messages?.length) {
      return NextResponse.json({ error: "messages required" }, { status: 400 });
    }

    // Fetch clinic data server-side
    const { data: clinicData, error: clinicError } = await supabaseAdmin
      .from("clinics")
      .select("*")
      .eq("name", "Aurora Aesthetics")
      .single();

    if (clinicError || !clinicData) {
      return NextResponse.json({ error: "Clinic not found" }, { status: 500 });
    }

    const clinic = clinicData as Clinic;
    const systemPrompt = buildSystemPrompt(clinic);

    const conversationMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: "system", content: systemPrompt },
      ...messages.map((m) => ({ role: m.role, content: m.content } as OpenAI.Chat.ChatCompletionMessageParam)),
    ];

    // First OpenAI call
    let response = await openai.chat.completions.create({
      model: "gpt-4o",
      max_tokens: 1024,
      tools: [CREATE_BOOKING_TOOL],
      messages: conversationMessages,
    });

    let assistantMessage = response.choices[0].message;

    // Agentic loop — handle tool calls then get final text response
    while (assistantMessage.tool_calls?.length) {
      const toolCall = assistantMessage.tool_calls[0];

      if (toolCall.type !== "function" || toolCall.function.name !== "create_booking") break;

      const input = JSON.parse(toolCall.function.arguments) as {
        patient_name: string;
        service: string;
        starts_at: string;
        patient_contact: string;
        raw_notes?: string;
      };

      // Execute the booking
      const { data: booking, error: bookingError } = await supabaseAdmin
        .from("bookings")
        .insert({
          clinic_id: clinic.id,
          patient_name: input.patient_name,
          service: input.service,
          starts_at: input.starts_at,
          patient_contact: input.patient_contact,
          raw_notes: input.raw_notes ?? null,
          status: "confirmed",
        })
        .select()
        .single();

      const toolResult = bookingError
        ? `Booking failed: ${bookingError.message}`
        : `Booking confirmed. ID: ${booking.id}. Patient: ${input.patient_name}, Service: ${input.service}, Time: ${input.starts_at}.`;

      // Continue with tool result
      response = await openai.chat.completions.create({
        model: "gpt-4o",
        max_tokens: 1024,
        tools: [CREATE_BOOKING_TOOL],
        messages: [
          ...conversationMessages,
          assistantMessage,
          { role: "tool", tool_call_id: toolCall.id, content: toolResult },
        ],
      });

      assistantMessage = response.choices[0].message;
    }

    const reply = assistantMessage.content ?? "Sorry, I didn't catch that. Could you try again?";

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("/api/chat error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
