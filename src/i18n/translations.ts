import { Language } from '../types';

export interface TranslationStrings {
  appName: string;
  tagline: string;
  welcomeTitle: string;
  welcomeSubtitle: string;
  welcomeDescription: string;
  newChat: string;
  chatHistory: string;
  noHistory: string;
  clearHistory: string;
  confirmClear: string;
  cancel: string;
  delete: string;
  rename: string;
  edit: string;
  save: string;
  inputPlaceholder: string;
  send: string;
  stop: string;
  copy: string;
  copied: string;
  readAloud: string;
  stopReading: string;
  clearChat: string;
  clearChatConfirm: string;
  retry: string;
  loadingMessage: string;
  modelSelector: string;
  modelsSubtitle: string;
  selectLanguage: string;
  guidesTitle: string;
  apiGuide: string;
  deployGuide: string;
  pwaGuide: string;
  features: string;
  suggestedPromptsTitle: string;
  suggestedPrompts: Array<{ label: string; prompt: string; icon: string }>;
  errors: {
    emptyMessage: string;
    apiKeyMissing: string;
    connectionError: string;
    serverError: string;
    speechNotSupported: string;
  };
  deployment: {
    title: string;
    subtitle: string;
    securingApiTitle: string;
    securingApiDesc: string;
    androidTipsTitle: string;
    androidTipsDesc: string;
    freeHostingTitle: string;
    hostingOptions: Array<{
      name: string;
      platform: string;
      tier: string;
      steps: string[];
    }>;
  };
}

export const translations: Record<Language, TranslationStrings> = {
  en: {
    appName: 'Amar AI Hub',
    tagline: 'Fast, secure & multilingual AI companion',
    welcomeTitle: 'Welcome to Amar AI Hub',
    welcomeSubtitle: 'Your intelligent companion powered by Google Gemini',
    welcomeDescription: 'Designed with a smooth dark mobile experience for Android phones and tablets. Ask anything in Bengali, Hindi, or English.',
    newChat: 'New Chat',
    chatHistory: 'Chat History',
    noHistory: 'No previous conversations yet',
    clearHistory: 'Clear All History',
    confirmClear: 'Are you sure you want to delete all saved conversations?',
    cancel: 'Cancel',
    delete: 'Delete',
    rename: 'Rename',
    edit: 'Edit',
    save: 'Save',
    inputPlaceholder: 'Ask anything or choose a suggestion below...',
    send: 'Send',
    stop: 'Stop',
    copy: 'Copy',
    copied: 'Copied!',
    readAloud: 'Listen',
    stopReading: 'Stop Audio',
    clearChat: 'Clear Current Chat',
    clearChatConfirm: 'Clear messages in this conversation?',
    retry: 'Retry',
    loadingMessage: 'Amar AI is thinking...',
    modelSelector: 'AI Model',
    modelsSubtitle: 'Choose or upgrade Gemini intelligence',
    selectLanguage: 'Language',
    guidesTitle: 'Setup & Deployment Guide',
    apiGuide: 'API Security',
    deployGuide: 'Free Hosting Guide',
    pwaGuide: 'Install on Android',
    features: 'Key Features',
    suggestedPromptsTitle: 'Try asking:',
    suggestedPrompts: [
      {
        label: 'Write an email',
        prompt: 'Write a professional email requesting leave from work for personal reasons.',
        icon: 'mail'
      },
      {
        label: 'Debug React code',
        prompt: 'Explain the difference between useEffect and useLayoutEffect in React with simple examples.',
        icon: 'code'
      },
      {
        label: 'Translate to Bengali',
        prompt: 'Translate this to natural Bengali: "Consistency and hard work will always bring success."',
        icon: 'globe'
      },
      {
        label: 'Explain in Hindi',
        prompt: 'Explain what Artificial Intelligence is in simple Hindi so that a beginner can understand.',
        icon: 'sparkles'
      }
    ],
    errors: {
      emptyMessage: 'Please type a message before sending.',
      apiKeyMissing: 'GEMINI_API_KEY is not configured on the server. Please add it to AI Studio Secrets or your server environment.',
      connectionError: 'Unable to reach Amar AI server. Please check your internet connection.',
      serverError: 'Something went wrong while generating the response. Please try again.',
      speechNotSupported: 'Speech recognition is not supported in this browser.'
    },
    deployment: {
      title: 'Free Hosting & Deployment Guide',
      subtitle: 'Complete beginner-friendly instructions for hosting Amar AI Hub for free on the cloud.',
      securingApiTitle: '1. How API Keys are Kept 100% Secure',
      securingApiDesc: 'Amar AI Hub uses an Express backend server proxy (/api/chat). The Google Gemini API key is stored strictly on the server in environment variables (process.env.GEMINI_API_KEY). The client browser or Android phone never sees or downloads your key.',
      androidTipsTitle: '2. Best Experience on Android Phones',
      androidTipsDesc: 'Open this app in Chrome on your Android phone, tap the 3-dots menu in the top-right corner, and select "Add to Home Screen" or "Install App". It will run full-screen just like a native app!',
      freeHostingTitle: '3. Free Hosting Platforms for Full-Stack Apps',
      hostingOptions: [
        {
          name: 'Google Cloud Run',
          platform: 'Google Cloud (Free Tier)',
          tier: 'Free tier includes 2M requests/month',
          steps: [
            'Push your repository to GitHub.',
            'Go to console.cloud.google.com and create a new Cloud Run service from your repo.',
            'Set the Port to 3000.',
            'In Environment Variables, add GEMINI_API_KEY with your key from Google AI Studio.',
            'Deploy! You get a fast, secure HTTPS URL.'
          ]
        },
        {
          name: 'Render.com',
          platform: 'Render Web Services',
          tier: 'Free tier with automatic HTTPS',
          steps: [
            'Sign up for free at render.com with GitHub.',
            'Click New + -> Web Service and connect your repository.',
            'Set Build Command: npm install && npm run build',
            'Set Start Command: npm start',
            'Under Environment Variables, add GEMINI_API_KEY.',
            'Click Create Web Service. Your app is live!'
          ]
        },
        {
          name: 'Vercel / Railway',
          platform: 'Vercel or Railway',
          tier: 'Hobby/Free plans available',
          steps: [
            'Connect your GitHub repo to Vercel or Railway.',
            'Add the GEMINI_API_KEY in the project Environment Variables.',
            'Click Deploy. Vercel automatically manages SSL and global CDN.'
          ]
        }
      ]
    }
  },
  bn: {
    appName: 'আমার এআই হাব',
    tagline: 'দ্রুত, নিরাপদ ও বহুভাষিক এআই সঙ্গী',
    welcomeTitle: 'আমার এআই হাবে স্বাগতম',
    welcomeSubtitle: 'গুগল জেমিনাই (Google Gemini) চালিত আপনার নির্ভরযোগ্য এআই সহকারী',
    welcomeDescription: 'অ্যান্ড্রয়েড ফোনের জন্য বিশেষভাবে অপটিমাইজ করা আধুনিক ডার্ক থিম ইন্টারফেস। বাংলা, হিন্দি বা ইংরেজিতে যেকোনো প্রশ্ন নির্দ্বিধায় করুন।',
    newChat: 'নতুন চ্যাট',
    chatHistory: 'পূর্বের চ্যাট ইতিহাস',
    noHistory: 'এখনও কোনো আগের চ্যাট সংরক্ষিত নেই',
    clearHistory: 'সব ইতিহাস মুছুন',
    confirmClear: 'আপনি কি নিশ্চিত যে সমস্ত সংরক্ষিত চ্যাট মুছে ফেলতে চান?',
    cancel: 'বাতিল',
    delete: 'মুছুন',
    rename: 'নাম পরিবর্তন',
    edit: 'সম্পাদনা',
    save: 'সংরক্ষণ',
    inputPlaceholder: 'আপনার প্রশ্ন বা বার্তা এখানে লিখুন...',
    send: 'পাঠান',
    stop: 'থামুন',
    copy: 'কপি',
    copied: 'কপি হয়েছে!',
    readAloud: 'শুনুন',
    stopReading: 'অডিও থামান',
    clearChat: 'বর্তমান চ্যাট মুছুন',
    clearChatConfirm: 'এই কথোপকথনের বার্তাগুলো কি মুছে ফেলতে চান?',
    retry: 'পুনরায় চেষ্টা',
    loadingMessage: 'আমার এআই ভাবছে...',
    modelSelector: 'এআই মডেল',
    modelsSubtitle: 'পছন্দের জেমিনাই মডেল নির্বাচন করুন',
    selectLanguage: 'ভাষা পরিবর্তন',
    guidesTitle: 'সেটআপ ও ডিপ্লয়মেন্ট নির্দেশিকা',
    apiGuide: 'এপিআই নিরাপত্তা',
    deployGuide: 'বিনামূল্যে হোস্টিং গাইড',
    pwaGuide: 'অ্যান্ড্রয়েডে ইনস্টল',
    features: 'প্রধান বৈশিষ্ট্যসমূহ',
    suggestedPromptsTitle: 'কিছু নমুনা প্রশ্ন শুরু করুন:',
    suggestedPrompts: [
      {
        label: 'বাংলায় কবিতা',
        prompt: 'বাংলাদেশ ও প্রকৃতির সৌন্দর্য নিয়ে চার লাইনের একটি মিষ্টি বাংলা কবিতা লিখুন।',
        icon: 'sparkles'
      },
      {
        label: 'অফিস ছুটির আবেদন',
        prompt: 'ব্যক্তিগত পারিবারিক কাজের জন্য অফিসে ২ দিনের ছুটির আবেদনপত্র লিখে দিন।',
        icon: 'mail'
      },
      {
        label: 'প্রোগ্রামিং সাহায্য',
        prompt: 'জাভাস্ক্রিপ্ট (JavaScript) এ async/await কীভাবে কাজ করে তা উদাহরণসহ সহজ বাংলায় বোঝান।',
        icon: 'code'
      },
      {
        label: 'হিন্দিতে অনুবাদ',
        prompt: 'এই বাক্যটি হিন্দিতে অনুবাদ করুন: "আমরা প্রযুক্তির সাহায্যে মানুষের জীবন সহজ করতে চাই।"',
        icon: 'globe'
      }
    ],
    errors: {
      emptyMessage: 'অনুগ্রহ করে বার্তা টাইপ করে পাঠান।',
      apiKeyMissing: 'সার্ভারে GEMINI_API_KEY সেট করা নেই। AI Studio Secrets অথবা .env ফাইলে কি যোগ করুন।',
      connectionError: 'সার্ভারের সাথে সংযোগ স্থাপন করা যায়নি। ইন্টারনেট সংযোগ চেক করুন।',
      serverError: 'উত্তর তৈরি করার সময় সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।',
      speechNotSupported: 'আপনার ব্রাউজারে ভয়েস টাইপিং সাপোর্ট নেই।'
    },
    deployment: {
      title: 'বিনামূল্যে হোস্টিং ও ডিপ্লয়মেন্ট গাইড',
      subtitle: 'অ্যান্ড্রয়েড ব্যবহারকারী ও নতুনদের জন্য সহজ ধাপে ধাপে নির্দেশিকা।',
      securingApiTitle: '১. কীভাবে এপিআই কী (API Key) সুরক্ষিত রাখা হয়?',
      securingApiDesc: 'আমার এআই হাব একটি এক্সপ্রেস ব্যাকএন্ড সার্ভার প্রক্সি ব্যবহার করে। গুগল জেমিনাই এপিআই কী কখনোই ব্রাউজার বা মোবাইলের ফ্রন্টএন্ড কোডে থাকে না। এটি শুধুমাত্র সার্ভারের সিক্রেট এনভায়রনমেন্টে থাকে।',
      androidTipsTitle: '২. অ্যান্ড্রয়েড ফোনে সেরা অভিজ্ঞতা',
      androidTipsDesc: 'আপনার অ্যান্ড্রয়েড ফোনের Chrome ব্রাউজারে অ্যাপটি খুলে উপরের ৩টি ডটে ট্যাপ করুন এবং "Add to Home screen" বা "Install App" চাপুন। অ্যাপটি ফুল-স্ক্রিনে নেটিভ অ্যাপের মতো চলবে!',
      freeHostingTitle: '৩. বিনামূল্যে ডিপ্লয় করার সহজ মাধ্যমসমূহ',
      hostingOptions: [
        {
          name: 'Render.com',
          platform: 'রেন্ডার ওয়েব সার্ভিস (Free)',
          tier: 'সম্পূর্ণ ফ্রি টায়ার ও ফ্রি SSL',
          steps: [
            'গিটহাবে (GitHub) কোড আপলোড করুন।',
            'render.com এ লগইন করে New Web Service এ ক্লিক করুন।',
            'Build Command দিন: npm install && npm run build',
            'Start Command দিন: npm start',
            'Environment Variables এ GEMINI_API_KEY বসিয়ে ডিপ্লয় করুন।'
          ]
        },
        {
          name: 'Google Cloud Run',
          platform: 'গুগল ক্লাউড রান',
          tier: 'প্রতি মাসে ২০ লক্ষ ফ্রি রিকোয়েস্ট',
          steps: [
            'গিটহাব রেপো কানেক্ট করুন।',
            'পোর্ট 3000 সিলেক্ট করুন।',
            'সিক্রেট হিসেবে GEMINI_API_KEY ভ্যারিয়েবল অ্যাড করুন।',
            'ডিপ্লয় বাটনে ক্লিক করলেই নিজস্ব লাইভ লিংক পেয়ে যাবেন।'
          ]
        },
        {
          name: 'Vercel / Railway',
          platform: 'ভার্সেল বা রেলওয়ে',
          tier: 'শুরু করার জন্য ফ্রি প্ল্যান',
          steps: [
            'GitHub অ্যাকাউন্ট দিয়ে কানেক্ট করুন।',
            'Environment Variables এ GEMINI_API_KEY যুক্ত করুন।',
            'স্বয়ংক্রিয়ভাবে বিল্ড হয়ে লাইভ ওয়েবসাইট তৈরি হবে।'
          ]
        }
      ]
    }
  },
  hi: {
    appName: 'अमर एआई हब',
    tagline: 'तेज़, सुरक्षित और बहुभाषी एआई साथी',
    welcomeTitle: 'अमर एआई हब में आपका स्वागत है',
    welcomeSubtitle: 'गूगल जेमिनी (Google Gemini) द्वारा संचालित आपका बुद्धिमान सहायक',
    welcomeDescription: 'एंड्रॉइड फोन के लिए विशेष रूप से डिज़ाइन किया गया आधुनिक डार्क थीम इंटरफ़ेस। हिंदी, बंगाली या अंग्रेजी में बेझिझक सवाल पूछें।',
    newChat: 'नई चैट',
    chatHistory: 'पिछला इतिहास',
    noHistory: 'अभी तक कोई सहेजी गई चैट नहीं है',
    clearHistory: 'सारा इतिहास साफ़ करें',
    confirmClear: 'क्या आप वाकई सभी सहेजी गई बातचीत को हटाना चाहते हैं?',
    cancel: 'रद्द करें',
    delete: 'हटाएं',
    rename: 'नाम बदलें',
    edit: 'संपादित करें',
    save: 'सहेजें',
    inputPlaceholder: 'यहाँ अपना प्रश्न लिखें या नीचे दिए गए सुझाव चुनें...',
    send: 'भेजें',
    stop: 'रोकें',
    copy: 'कॉपी',
    copied: 'कॉपी हो गया!',
    readAloud: 'सुनें',
    stopReading: 'ऑडियो रोकें',
    clearChat: 'वर्तमान चैट साफ़ करें',
    clearChatConfirm: 'क्या आप इस बातचीत के सभी संदेश हटाना चाहते हैं?',
    retry: 'पुनः प्रयास',
    loadingMessage: 'अमर एआई सोच रहा है...',
    modelSelector: 'एआई मॉडल',
    modelsSubtitle: 'अपनी पसंद का जेमिनी मॉडल चुनें',
    selectLanguage: 'भाषा चुनें',
    guidesTitle: 'सेटअप और डिप्लॉयमेंट गाइड',
    apiGuide: 'एपीआई सुरक्षा',
    deployGuide: 'फ्री होस्टिंग गाइड',
    pwaGuide: 'एंड्रॉइड पर इंस्टॉल करें',
    features: 'मुख्य विशेषताएं',
    suggestedPromptsTitle: 'शुरुआत के लिए सुझाव:',
    suggestedPrompts: [
      {
        label: 'हिंदी में कहानी',
        prompt: 'बच्चों के लिए नैतिक शिक्षा देने वाली एक छोटी और सुंदर हिंदी कहानी लिखें।',
        icon: 'sparkles'
      },
      {
        label: 'अवकाश का आवेदन',
        prompt: 'स्वास्थ्य कारणों से कार्यालय से २ दिन की छुट्टी के लिए एक औपचारिक ईमेल लिखें।',
        icon: 'mail'
      },
      {
        label: 'कोडिंग सहायता',
        prompt: 'पायथन (Python) में लिस्ट और टुपल में क्या अंतर है? उदाहरण सहित समझाइए।',
        icon: 'code'
      },
      {
        label: 'बंगाली में अनुवाद',
        prompt: 'इस वाक्य का बंगाली में अनुवाद करें: "कठिन परिश्रम और धैर्य हमेशा सफलता लाते हैं।"',
        icon: 'globe'
      }
    ],
    errors: {
      emptyMessage: 'कृपया भेजने से पहले संदेश टाइप करें।',
      apiKeyMissing: 'सर्वर पर GEMINI_API_KEY मौजूद नहीं है। कृपया इसे AI Studio Secrets या .env में सेट करें।',
      connectionError: 'सर्वर से संपर्क नहीं हो पाया। इंटरनेट कनेक्शन जांचें।',
      serverError: 'उत्तर तैयार करते समय कोई समस्या हुई। कृपया पुनः प्रयास करें।',
      speechNotSupported: 'आपके ब्राउज़र में वॉइस टाइपिंग समर्थित नहीं है।'
    },
    deployment: {
      title: 'मुफ्त होस्टिंग और डिप्लॉयमेंट गाइड',
      subtitle: 'एंड्रॉइड और शुरुआती उपयोगकर्ताओं के लिए आसान चरणबद्ध निर्देश।',
      securingApiTitle: '१. एपीआई की (API Key) कैसे सुरक्षित रखी जाती है?',
      securingApiDesc: 'अमर एआई हब एक एक्सप्रेस बैकएंड सर्वर प्रॉक्सी (/api/chat) का उपयोग करता है। गूगल जेमिनी की एपीआई की केवल सर्वर एनवायरनमेंट में रहती है और मोबाइल ब्राउज़र को कभी नहीं दिखाई देती।',
      androidTipsTitle: '२. एंड्रॉइड फोन पर सर्वश्रेष्ठ अनुभव',
      androidTipsDesc: 'अपने फोन के Chrome ब्राउज़र में इस ऐप को खोलें, ऊपर दाईं ओर ३ बिंदुओं पर टैप करें और "Add to Home screen" या "Install app" चुनें। यह एक असली ऐप की तरह खुलेगी!',
      freeHostingTitle: '३. मुफ्त डिप्लॉय करने के आसान मंच',
      hostingOptions: [
        {
          name: 'Render.com',
          platform: 'रेंडर वेब सर्विस',
          tier: 'मुफ्त टियर और फ्री SSL सर्टिफिकेट',
          steps: [
            'अपना कोड GitHub पर पुश करें।',
            'render.com पर लॉगिन करके New Web Service पर क्लिक करें।',
            'Build Command: npm install && npm run build',
            'Start Command: npm start',
            'Environment Variables में GEMINI_API_KEY जोड़ें और डिप्लॉय करें।'
          ]
        },
        {
          name: 'Google Cloud Run',
          platform: 'गूगल क्लाउड रन',
          tier: 'प्रति माह 20 लाख मुफ्त अनुरोध',
          steps: [
            'GitHub रिपॉजिटरी को कनेक्ट करें।',
            'Port 3000 सेट करें।',
            'Environment Variables में GEMINI_API_KEY जोड़ें।',
            'डिप्लॉय करें और एक सुरक्षित HTTPS लिंक प्राप्त करें।'
          ]
        },
        {
          name: 'Vercel / Railway',
          platform: 'वर्सेल या रेलवे',
          tier: 'शुरुआती मुफ्त योजनाएं',
          steps: [
            'GitHub से जोड़ें।',
            'GEMINI_API_KEY जोड़ें।',
            'Deploy पर क्लिक करते ही ऐप लाइव हो जाएगा।'
          ]
        }
      ]
    }
  }
};
