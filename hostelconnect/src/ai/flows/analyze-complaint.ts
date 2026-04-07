'use server';
/**
 * @fileOverview A Genkit flow for analyzing anonymous complaints.
 *
 * - analyzeComplaint - A function that handles the complaint analysis process.
 * - AnalyzeComplaintInput - The input type for the analyzeComplaint function.
 * - AnalyzeComplaintOutput - The return type for the analyzeComplaint function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeComplaintInputSchema = z.object({
  complaintDescription: z
    .string()
    .describe('The description of the anonymous complaint.'),
});
export type AnalyzeComplaintInput = z.infer<typeof AnalyzeComplaintInputSchema>;

const AnalyzeComplaintOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the complaint.'),
  suggestedCategories: z
    .array(z.string())
    .describe(
      "An array of suggested categories for the complaint (e.g., 'Maintenance', 'Food Quality', 'Behavior', 'Harassment', 'Safety', 'Administration', 'Facility', 'Other')."
    ),
});
export type AnalyzeComplaintOutput = z.infer<
  typeof AnalyzeComplaintOutputSchema
>;

export async function analyzeComplaint(
  input: AnalyzeComplaintInput
): Promise<AnalyzeComplaintOutput> {
  return analyzeComplaintFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeComplaintPrompt',
  input: {schema: AnalyzeComplaintInputSchema},
  output: {schema: AnalyzeComplaintOutputSchema},
  prompt: `You are an AI assistant designed to analyze anonymous complaints.
Your task is to read the provided complaint, summarize it concisely, and then suggest relevant categories from a predefined list.

Predefined Categories: 'Maintenance', 'Food Quality', 'Behavior', 'Harassment', 'Safety', 'Administration', 'Facility', 'Other'.

Complaint Description: """{{{complaintDescription}}}"""

Please provide a summary and select the most appropriate categories. Ensure the categories are directly from the predefined list.`,
});

const analyzeComplaintFlow = ai.defineFlow(
  {
    name: 'analyzeComplaintFlow',
    inputSchema: AnalyzeComplaintInputSchema,
    outputSchema: AnalyzeComplaintOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
