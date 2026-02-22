export const examConfig = {
  ssc_chsl: {
    name: "SSC CHSL",
    duration: 600, // 10 min
    backspaceAllowed: true,
    passingWpm: 35,
    passingAccuracy: 95,
    language: "english",
    paragraphType: "ssc_chsl",
    logo: "/ssc-chsl.png",
  },

  ssc_cgl: {
    name: "SSC CGL",
    duration: 900,
    backspaceAllowed: true,
    passingWpm: 30,
    passingAccuracy: 95,
    language: "english",
    paragraphType: "ssc_cgl",
    logo: "/ssc-cgl.png",
  },

  rrb_ntpc: {
    name: "Railway Typing",
    duration: 600,
    backspaceAllowed: false,
    passingWpm: 35,
    passingAccuracy: 90,
    language: "english",
    paragraphType: "rrb_ntpc",
    logo: "railway.png"
    
  }
}
// } as const


export type ExamType = keyof typeof examConfig