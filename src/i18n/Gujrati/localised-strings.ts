export const localisedStrings = {
    welcomeMessage: `હાય 👋 આપનું સ્વાગત છે Khabri Media Bot માં!🤖 આપને દુનિયા ભરમાં સમાચાર 🌍, આપની પ્રદેશ 🏡, ખેલની નવીનતમ અપડેટ ⚽, શિક્ષા અને વ્યાપાર 🎓 મળશે. અમારી સાથે વીચ્યુ અને તમામ સમાચાર મેળવો! 🎉`,
    selectLanguage: `કૃપા કરીને તમારી પસંદગીની ભાષા પસંદ કરો | 😊`,
    goBackToMainMenu: 'મુખ્ય મેનુ પર જાઓ',
    browseOtherCategories: 'અન્ય શ્રેણીઓ જુઓ',
    selectNewsCategory: 'કૃપા કરીને પસંદ કરો કઈ સમાચાર શ્રેણી તમે શોધો છો? 🌍⚽🏡🎓',
    selectSubNewsCategory: `ક્યારેક સમાચાર શ્રેણી જોવી છે? 😊🗞️`,
    seeMoreNews: 'આપવી મેળવો છે',
    thatsAllNewsForToday: (category: string) => {
      return `આજ માટે આ બધા સમાચાર છે, ${category}! 🗞️ અને આવડે તો બીજી કોઇ શ્રેણી પસંદ કરો અને અપડેટ મેળવો! 📰💼🎯`;
    },
    noMoreNewsAvailable: (category: string) => {
     return `આજના ${category} શ્રેણી માટે વધુ સમાચાર ઉપલબ્ધ નથી. 📰 અન્ય શ્રેણીઓ માટે અપડેટ જોઈએ. 🚀`;
    },
    seeMore: `વધુ માહિતી માટે નીચે આપેલ બટન પર ક્લિક કરો. 📰 તમે 'અન્ય શ્રેણીઓ જુઓ' પર ક્લિક કરી શકો છો અને 'મુખ્ય મેનુ પર જાઓ' પર ક્લિક કરી શકો છો અને વધુ સમાચાર જુઓ. 🏠`,
    topNewsTag: 'શ્રેષ્ઠ સમાચાર',
    userLanguageSelection: 'gujrati',
  };
  
  
  export const getLocalString = (messageKey: string): any => {
    return localisedStrings[messageKey];
  };
  
  export const Messages = {
    welcomeMessage: 'welcomeMessage',
    goBackToMainMenu: 'goBackToMainMenu',
    browseOtherCategories: 'browseOtherCategories',
    seeMoreNews: 'seeMoreNews',
    thatsAllNewsForToday: 'thatsAllNewsForToday',
    noMoreNewsAvailable: 'noMoreNewsAvailable',
    userLanguageSelection: 'userLanguageSelection',
  };