export interface ReplyOption {
  text: string;
  response: string;
  isSafeChoice: boolean;
}

export interface ScamScenario {
  id: string;
  channel: 'SMS Text' | 'Voicemail (AI Voice)' | 'Email' | 'DM / Social';
  sender: string;
  senderHandle: string;
  timestamp: string;
  subject?: string;
  message: string;
  isScam: boolean;
  difficulty: 'Easy' | 'Medium' | 'Hard (AI Era)';
  redFlags: string[];
  explanation: string;
  replyOptions: ReplyOption[];
  hasLink?: boolean;
  linkDestinationUrl?: string;
}

export const SCENARIOS: ScamScenario[] = [
  {
    id: '1',
    channel: 'SMS Text',
    sender: 'USPS Delivery Alert',
    senderHandle: '+1 (808) 555-0194',
    timestamp: 'Today, 10:14 AM',
    message:
      'USPS Notice: Your package #US-948201 cannot be delivered due to an incomplete street address. Please confirm your address and pay the $0.30 redelivery fee within 12 hours or the item will be returned: https://usps-track-redelivery-portal.com/resolve',
    isScam: true,
    difficulty: 'Easy',
    hasLink: true,
    linkDestinationUrl: 'https://usps-track-redelivery-portal.com/resolve',
    redFlags: [
      'Came from a standard 10-digit phone number instead of an official USPS short code.',
      'Fake lookalike URL ("usps-track-redelivery-portal.com") instead of official "usps.com".',
      'Demands a tiny "$0.30 fee" just to harvest your credit card number.',
    ],
    explanation:
      'Classic "Smishing" (SMS Phishing). USPS never texts you from random numbers asking for credit card fees to fix an address.',
    replyOptions: [
      {
        text: 'Reply: "Which package is this? I just ordered something."',
        response: 'Trap! Engaging confirms your number is active, and they send a phishing link next.',
        isSafeChoice: false,
      },
      {
        text: 'Reply: "Stop texting me, I am reporting this number!"',
        response: 'Trap! Scammers use automated scripts; replying shows a live human is reading it.',
        isSafeChoice: false,
      },
      {
        text: 'Click the link just to see what address it has on file.',
        response: 'Credential Harvested! The link installs tracking cookies or steals browser autofill data.',
        isSafeChoice: false,
      },
      {
        text: 'Ignore completely, block the number, and check the official USPS app.',
        response: 'Correct! Zero engagement is the only safe way to handle smishing.',
        isSafeChoice: true,
      },
    ],
  },
  {
    id: '2',
    channel: 'Voicemail (AI Voice)',
    sender: 'Unknown Caller (Sounds like Mom)',
    senderHandle: 'No Caller ID • 0:24s',
    timestamp: 'Today, 2:42 PM',
    message:
      '[Audio Transcript]: "Hey sweetie, my phone just died and I got into a minor fender bender. I am using a tow truck driver’s phone. My wallet is locked in the car—can you Zelle $380 to the driver’s number right now at (704) 555-0148 so he can release the car? Please hurry, my battery is at 2%."',
    isScam: true,
    difficulty: 'Hard (AI Era)',
    redFlags: [
      'Scammers only need 3 seconds of audio from social media to clone a family member’s voice using AI.',
      'Extreme urgency ("Please hurry") + excuse why you cannot call them back ("using the driver’s phone").',
      'Payment requested via Zelle to an unknown third party (Zelle transfers are instant and irreversible).',
    ],
    explanation:
      'AI Voice Cloning Emergency Scam. Always hang up and call your family member’s actual phone number directly, or ask a "family safe word" question.',
    replyOptions: [
      {
        text: 'Send $380 via Zelle immediately so Mom is not stranded.',
        response: 'Money is instantly wired to an overseas scammer account and cannot be reversed.',
        isSafeChoice: false,
      },
      {
        text: 'Text the tow truck driver back: "Put my mom on the phone right now."',
        response: 'Scammers use pre-recorded AI audio snippets that sound convincing, trapping you further.',
        isSafeChoice: false,
      },
      {
        text: 'Call your mom’s actual phone number directly to verify if she is safe.',
        response: 'Smart! Mom picks up at home totally fine. You just bypassed an advanced AI voice clone scam.',
        isSafeChoice: true,
      },
      {
        text: 'Post the audio on social media asking: "Is this my mom\'s voice?"',
        response: 'Risky! You are exposing your family member’s cloned voice sample publicly.',
        isSafeChoice: false,
      },
    ],
  },
  {
    id: '3',
    channel: 'Email',
    sender: 'University Financial Aid Office',
    senderHandle: 'aid-disbursement@student-portal-verify.org',
    timestamp: 'Yesterday, 4:15 PM',
    subject: 'URGENT: Fall Tuition Grant Refund Pending ($1,450.00)',
    message:
      'Dear Student,\n\nYour $1,450.00 federal tuition grant refund has been processed. However, our system detected an outdated bank routing profile.\n\nClick below to sign in with your University NetID and password within 24 hours, or your grant will be forfeited.\n\nRegards,\nCampus Student Accounts',
    isScam: true,
    difficulty: 'Medium',
    hasLink: true,
    linkDestinationUrl: 'https://student-portal-verify.org/login',
    redFlags: [
      'Sender domain ends in ".org" ("student-portal-verify.org") instead of an official ".edu" school address.',
      'Threatens that you will "forfeit" money in 24 hours to cause panic.',
      'Phishes for your University NetID login so scammers can hijack your direct deposit profile.',
    ],
    explanation:
      'College & Youth Targeted Phishing. Young adults lose millions annually to fake financial aid and campus job emails.',
    replyOptions: [
      {
        text: 'Click the link and log in quickly so you don’t lose the $1,450 refund.',
        response: 'Credential Harvested! Scammers log into your real school portal and change your direct deposit info.',
        isSafeChoice: false,
      },
      {
        text: 'Reply to the email: "Please fix this for me, here is my student ID number."',
        response: 'You just handed your personal student records straight to an internet scammer.',
        isSafeChoice: false,
      },
      {
        text: 'Forward the email to your campus IT security desk and check your official portal.',
        response: 'Correct! Reporting to IT protects other students on campus while keeping your account secure.',
        isSafeChoice: true,
      },
      {
        text: 'Ignore it and hope the money shows up in your bank account anyway.',
        response: 'Better than clicking, but unsafe if you left a phishing email un-reported in your inbox.',
        isSafeChoice: false,
      },
    ],
  },
  {
    id: '4',
    channel: 'SMS Text',
    sender: 'Chase Fraud Prevention',
    senderHandle: '72166',
    timestamp: 'Yesterday, 6:05 PM',
    message:
      'Chase Fraud Alert: Did you attempt a $412.50 purchase at ELECTRONICS HUB MIAMI FL on card ending in 4821? Reply YES or NO. If NO, we will block the charge. Never share your passcode with anyone.',
    isScam: false,
    difficulty: 'Medium',
    redFlags: [
      'NO RED FLAGS — This is a legitimate bank security alert!',
      'Sent from an official 5-digit bank short code (72166).',
      'Does NOT include a shady link and explicitly warns you never to share passcodes.',
    ],
    explanation:
      'Not every alert is a scam! Real bank texts ask simple YES/NO verification without links or passcode requests.',
    replyOptions: [
      {
        text: 'Ignore the text because you assume all bank alerts are text scams.',
        response: 'Dangerous! If a real fraudster is using your card, ignoring the alert leaves your account vulnerable.',
        isSafeChoice: false,
      },
      {
        text: 'Call a random phone number you found on Google instead of replying.',
        response: 'Unnecessary delay—this was a secure, official automated short code.',
        isSafeChoice: false,
      },
      {
        text: 'Reply "NO" to block the fraudulent charge safely.',
        response: 'Correct! Official short codes allow secure two-way replies to protect your funds.',
        isSafeChoice: true,
      },
      {
        text: 'Reply with your full credit card number and PIN to prove who you are.',
        response: 'Never do this! Real banks will never ask for your PIN via text message.',
        isSafeChoice: false,
      },
    ],
  },
  {
    id: '5',
    channel: 'DM / Social',
    sender: 'Campus Brand Ambassador Recruiter',
    senderHandle: '@stella_talent_recruiting',
    timestamp: '2 days ago',
    message:
      'Hey! We loved your profile and want to send you free merch + pay you $300/week! We already e-mailed you a $500 check to cover starter gear—just mobile deposit the check today and Venmo $200 back to our graphic designer for custom promo codes!',
    isScam: true,
    difficulty: 'Medium',
    redFlags: [
      'The "Fake Check Overpayment" trick: They send a check and ask you to Venmo cash back.',
      'Bank funds appear in 24 hours, but the fake check bounces 5 days later—leaving you down $200 of your own money.',
      'Real employers never ask you to wire or Venmo money back to vendors.',
    ],
    explanation:
      'Influencer & Remote Job Overpayment Scam. Currently the #1 scam targeting teens and college students on social media.',
    replyOptions: [
      {
        text: 'Deposit the check in your mobile banking app and Venmo the $200 back.',
        response: 'The check bounces in 5 days! Your bank takes back the full $500 and your personal account is flagged for fraud.',
        isSafeChoice: false,
      },
      {
        text: 'Reply: "Can you make it $500/week instead of $300?"',
        response: 'Scammers will gladly agree to anything as long as you agree to cash their fake check.',
        isSafeChoice: false,
      },
      {
        text: 'Block the Instagram account and report them for job fraud.',
        response: 'Correct! Real companies never pay you with checks that require you to send cash back via Venmo.',
        isSafeChoice: true,
      },
      {
        text: 'Ask your friends in the group chat if they want to take the brand deal.',
        response: 'Unsafe! You might accidentally spread the financial scam to your friends.',
        isSafeChoice: false,
      },
    ],
  },
  {
    id: '6',
    channel: 'DM / Social',
    sender: 'Crypto Giveaways Official',
    senderHandle: '@eth_airdrop_2026',
    timestamp: '3 days ago',
    message:
      'CONGRATS! You were randomly selected from Instagram to receive 2.5 Ethereum (~$6,500 USD)! Connect your MetaMask wallet to our claim portal right now before the smart contract expires: https://eth-airdrop-claim-tokens.net',
    isScam: true,
    difficulty: 'Hard (AI Era)',
    hasLink: true,
    linkDestinationUrl: 'https://eth-airdrop-claim-tokens.net',
    redFlags: [
      'Random unsolicited DMs claiming you won cryptocurrency out of nowhere are always scams.',
      'Fake lookalike domain ("eth-airdrop-claim-tokens.net") designed to prompt wallet signatures.',
      'Connecting a wallet to a malicious site allows scammers to instantly drain all your crypto assets.',
    ],
    explanation:
      'Crypto Drainer & Web3 Phishing Scam. Smart contracts can be written to steal every coin in your wallet upon approval.',
    replyOptions: [
      {
        text: 'Connect your crypto wallet to claim the free $6,500.',
        response: 'Wallet Drained! Malicious smart contract executes and steals your entire crypto balance.',
        isSafeChoice: false,
      },
      {
        text: 'Reply: "How do I know this is real?"',
        response: 'Scammers send fake testimonials and screenshots to convince you further.',
        isSafeChoice: false,
      },
      {
        text: 'Block the account, report spam, and ignore the airdrop.',
        response: 'Correct! Free money DMs on social media are 100% financial traps.',
        isSafeChoice: true,
      },
      {
        text: 'Send your wallet seed phrase so they can deposit it manually.',
        response: 'Never share your seed phrase with anyone! You lose full control of your wallet.',
        isSafeChoice: false,
      },
    ],
  },
  {
    id: '7',
    channel: 'SMS Text',
    sender: 'Netflix Billing Dept',
    senderHandle: '+1 (555) 019-8231',
    timestamp: '4 days ago',
    message:
      'Netflix: Your monthly subscription payment failed due to an invalid billing address or expired credit card. Your account will be suspended today unless you update payment info: https://netflix-account-update-billing.com',
    isScam: true,
    difficulty: 'Easy',
    hasLink: true,
    linkDestinationUrl: 'https://netflix-account-update-billing.com',
    redFlags: [
      'Sent from a standard mobile phone number instead of Netflix’s official automated system.',
      'Fake generic billing URL instead of logging directly into Netflix.com.',
      'Creates false panic ("suspended today") to rush your decision.',
    ],
    explanation:
      'Subscription Phishing Scam. Scammers send bulk texts hoping to catch people who happen to subscribe to Netflix.',
    replyOptions: [
      {
        text: 'Click the link to update your credit card so your shows don\'t stop.',
        response: 'Credit Card Stolen! Scammers harvest your card info and start unauthorized subscriptions.',
        isSafeChoice: false,
      },
      {
        text: 'Open the official Netflix app or website independently to check your billing status.',
        response: 'Correct! Your account is active and paid. Always check official apps directly.',
        isSafeChoice: true,
      },
      {
        text: 'Reply: "I just paid this yesterday!"',
        response: 'Engaging confirms your phone number is active for future scam lists.',
        isSafeChoice: false,
      },
      {
        text: 'Delete the text and ignore it.',
        response: 'Safe, but logging into the official app gives absolute peace of mind.',
        isSafeChoice: false,
      },
    ],
  },
  {
    id: '8',
    channel: 'Email',
    sender: 'Geek Squad Support',
    senderHandle: 'billing@geek-squad-renewals-support.info',
    timestamp: '5 days ago',
    subject: 'INVOICE RECEIPT: Your Annual Total Security Subscription ($349.99)',
    message:
      'Dear Customer, Thank you for renewing your 3-year Geek Squad Total Protection plan. $349.99 has been charged to your default card on file. If you wish to CANCEL and receive a REFUND, call our customer support helpline immediately at +1 (888) 555-0199.',
    isScam: true,
    difficulty: 'Medium',
    redFlags: [
      'Sender email ends in ".info" ("geek-squad-renewals-support.info") instead of BestBuy.com.',
      'Mentions a massive charge ($349.99) to cause instant panic and force you to call the number.',
      'The "Refund Scam": When you call, they pretend to send a refund but accidentally type "$3,499" instead of "$349" and beg you to buy gift cards to fix their mistake.',
    ],
    explanation:
      'Tech Support Refund Scam. One of the most common scams targeting adults and seniors to steal bank access via remote desktop software.',
    replyOptions: [
      {
        text: 'Call the phone number in the email immediately to cancel the $349.99 charge.',
        response: 'Trap! Scammers answer pretending to be Geek Squad, tricking you into installing remote desktop software.',
        isSafeChoice: false,
      },
      {
        text: 'Forward the email to phishing@bestbuy.com and check your actual bank statements.',
        response: 'Correct! No charge exists on your real bank account. You successfully spotted a phantom invoice scam.',
        isSafeChoice: true,
      },
      {
        text: 'Reply to the email telling them they charged the wrong person.',
        response: 'Scammers reply or call you back directly to push their refund trap further.',
        isSafeChoice: false,
      },
      {
        text: 'Delete the email and do nothing.',
        response: 'Safe, though reporting it helps security teams take down the domain.',
        isSafeChoice: false,
      },
    ],
  },
  {
    id: '9',
    channel: 'SMS Text',
    sender: 'Apple Security',
    senderHandle: 'Alert-System',
    timestamp: '6 days ago',
    message:
      'Apple ID Alert: Your iPhone was used to sign in from a new device in Beijing, China. If this was NOT you, secure your account and verify your identity immediately: https://appleid.support-icloud-login.com',
    isScam: true,
    difficulty: 'Medium',
    hasLink: true,
    linkDestinationUrl: 'https://appleid.support-icloud-login.com',
    redFlags: [
      'Fake lookalike URL ("appleid.support-icloud-login.com") instead of appleid.apple.com.',
      'Scary international location ("Beijing, China") designed to make you panic and click instantly.',
      'Real Apple security alerts appear natively in your iPhone Settings menu, never as sketchy links in text messages.',
    ],
    explanation:
      'Apple ID Credential Harvesting. Scammers want your Apple ID password so they can lock your iPhone remotely and demand ransom.',
    replyOptions: [
      {
        text: 'Click the link and log in with your Apple ID password to lock down the hacker.',
        response: 'Account Hacked! Scammers now control your iCloud photos, passwords, and can lock your physical iPhone.',
        isSafeChoice: false,
      },
      {
        text: 'Go to your iPhone Settings > [Your Name] to check your real trusted devices.',
        response: 'Correct! Your settings show zero unauthorized logins. You avoided an Apple ID phishing trap.',
        isSafeChoice: true,
      },
      {
        text: 'Reply "STOP" to the text message.',
        response: 'Replying does nothing because automated phishing texts do not process SMS replies.',
        isSafeChoice: false,
      },
      {
        text: 'Call the number listed in the text message.',
        response: 'There is no phone number, only a malicious link designed to steal your login.',
        isSafeChoice: false,
      },
    ],
  },
  {
    id: '10',
    channel: 'SMS Text',
    sender: 'Local Electric Utility',
    senderHandle: 'Power-Notice',
    timestamp: '1 week ago',
    message:
      'FINAL NOTICE: Your electricity service will be disconnected in 2 hours due to an overdue past-due meter balance of $128.40. Pay immediately via Zelle or cryptocurrency to avoid immediate blackouts.',
    isScam: true,
    difficulty: 'Easy',
    redFlags: [
      'Utility companies never demand immediate payment via Zelle or cryptocurrency under a 2-hour threat.',
      'Real utilities send official mail warnings and provide standard billing portal options on your monthly statement.',
      'Extreme manufactured urgency to prevent you from calling your actual utility provider to verify.',
    ],
    explanation:
      'Utility Disconnection Scam. Common extortion scam targeting residents and small businesses.',
    replyOptions: [
      {
        text: 'Send $128.40 via Zelle so your power doesn’t get shut off.',
        response: 'Money lost instantly! Scammers take the cash and your power remains unaffected because you never owed anything.',
        isSafeChoice: false,
      },
      {
        text: 'Call your utility provider using the official phone number printed on your paper electric bill.',
        response: 'Correct! Your utility company confirms your account has a $0 balance and warns you about active phone scams.',
        isSafeChoice: true,
      },
      {
        text: 'Reply to the text asking if they accept credit cards over the phone.',
        response: 'Scammers will take your credit card info and max it out immediately.',
        isSafeChoice: false,
      },
      {
        text: 'Unplug your router and turn off your lights to save electricity.',
        response: 'Unnecessary—your power company has nothing to do with this scam text.',
        isSafeChoice: false,
      },
    ],
  },
];