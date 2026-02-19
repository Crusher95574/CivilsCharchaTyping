export interface ExamParagraph {
  id: string
  exam: string
  text: string
  duration: number // minutes
  passingWpm: number
  passingAccuracy: number
}

export const examParagraphs: ExamParagraph[] = [
  {
    id: "1",
    exam: "ssc_cgl",
    duration: 5,
    passingWpm: 30,
    passingAccuracy: 85,
    text: `India is a land of diverse cultures and traditions. The country has
    a rich history that dates back thousands of years. People from
    different religions and backgrounds live together in harmony.`,
  },
  {
    id: "2",
    exam: "ssc_cgl",
    duration: 5,
    passingWpm: 30,
    passingAccuracy: 85,
    text: `Technology has transformed the way we communicate and work.
    The rise of digital platforms has made information accessible to
    everyone across the globe.`,
  },
]
