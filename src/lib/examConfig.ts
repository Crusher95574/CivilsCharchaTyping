export const examConfig = {
  ssc_chsl: {
    name: "SSC CHSL",
    duration: 600, // 10 min
    backspaceAllowed: true,
    passingWpm: 35,
    passingAccuracy: 95,
    language: "english",
    paragraphType: "ssc"
  },

  ssc_cgl: {
    name: "SSC CGL",
    duration: 900,
    backspaceAllowed: true,
    passingWpm: 40,
    passingAccuracy: 95,
    language: "english",
    paragraphType: "ssc"
  },

  railway: {
    name: "Railway Typing",
    duration: 600,
    backspaceAllowed: false,
    passingWpm: 30,
    passingAccuracy: 90,
    language: "english",
    paragraphType: "railway"
  }
}
