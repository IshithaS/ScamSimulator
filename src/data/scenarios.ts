export interface ReplyOption {
  text: string;
  response: string;
  isSafeChoice: boolean;
}

export interface ScamScenario {
  id: string;
  scamType: string;
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

interface ScenarioTemplate {
  typeId: string;
  scamType: string;
  channel: 'SMS Text' | 'Voicemail (AI Voice)' | 'Email' | 'DM / Social';
  isScam: boolean;
  difficulty: 'Easy' | 'Medium' | 'Hard (AI Era)';
  redFlags: string[];
  explanation: string;
  replyOptions: ReplyOption[];
  examples: {
    sender: string;
    senderHandle: string;
    timestamp: string;
    subject?: string;
    message: string;
    hasLink?: boolean;
    linkDestinationUrl?: string;
  }[];
}

const SCENARIO_TEMPLATES: ScenarioTemplate[] = [
  // TYPE 1: Package Delivery Smishing (4 Examples)
  {
    typeId: '1',
    scamType: 'Type 1: Package Delivery Smishing',
    channel: 'SMS Text',
    isScam: true,
    difficulty: 'Easy',
    redFlags: [
      'Sent from a standard 10-digit phone number instead of an official carrier short code.',
      'Uses a fake lookalike URL to steal credit card details.',
      'Demands a tiny redelivery or customs fee to trigger impulsive payment.',
    ],
    explanation:
      'Delivery carriers (USPS, FedEx, UPS, Amazon) never text you from random numbers asking for credit card fees to release a package.',
    replyOptions: [
      {
        text: 'Reply: "Which package is this? I just ordered something."',
        response: 'Trap! Replying confirms your number is active for future scam waves.',
        isSafeChoice: false,
      },
      {
        text: 'Reply: "Stop texting me, I am reporting this number!"',
        response: 'Trap! Arguing with automated scam bots flags your number as a live human.',
        isSafeChoice: false,
      },
      {
        text: 'Tap the link just to see what address it has on file.',
        response: 'Dangerous! The phishing site harvests browser autofill data and card info.',
        isSafeChoice: false,
      },
      {
        text: 'Ignore completely, block the number, and check the official carrier app.',
        response: 'Correct! Zero engagement is the only safe way to handle delivery smishing.',
        isSafeChoice: true,
      },
    ],
    examples: [
      {
        sender: 'USPS Delivery Alert (Ex 1/4)',
        senderHandle: '+1 (808) 555-0194',
        timestamp: 'Today, 10:14 AM',
        message:
          'USPS Notice: Your package #US-948201 cannot be delivered due to an incomplete street address. Confirm your address and pay the $0.30 redelivery fee within 12 hours: https://usps-track-redelivery-portal.com/resolve',
        hasLink: true,
        linkDestinationUrl: 'https://usps-track-redelivery-portal.com/resolve',
      },
      {
        sender: 'FedEx Customs Hold (Ex 2/4)',
        senderHandle: '+1 (305) 555-0182',
        timestamp: 'Today, 11:30 AM',
        message:
          'FedEx Alert: Shipment #FX-22910 is held at our distribution center due to $1.15 unpaid import duty. Pay now to avoid return to sender: https://fedex-clearance-fee.net/pay',
        hasLink: true,
        linkDestinationUrl: 'https://fedex-clearance-fee.net/pay',
      },
      {
        sender: 'UPS Dispatch Center (Ex 3/4)',
        senderHandle: '+1 (404) 555-0119',
        timestamp: 'Yesterday, 3:45 PM',
        message:
          'UPS InfoNotice: We missed you today! Reschedule your delivery and pay the $0.99 handling surcharge here: https://ups-mychoice-reschedule-pkg.org',
        hasLink: true,
        linkDestinationUrl: 'https://ups-mychoice-reschedule-pkg.org',
      },
      {
        sender: 'Amazon Prime Logistics (Ex 4/4)',
        senderHandle: '+1 (206) 555-0167',
        timestamp: 'Yesterday, 5:10 PM',
        message:
          'Amazon Locker Alert: Your Prime order #114-99201 cannot fit in your local locker. Verify your billing card for home drop-off: https://amzn-locker-redirect.info',
        hasLink: true,
        linkDestinationUrl: 'https://amzn-locker-redirect.info',
      },
    ],
  },

  // TYPE 2: AI Voice Cloning Emergency (4 Examples)
  {
    typeId: '2',
    scamType: 'Type 2: AI Voice Clone Emergency',
    channel: 'Voicemail (AI Voice)',
    isScam: true,
    difficulty: 'Hard (AI Era)',
    redFlags: [
      'Scammers only need 3 seconds of social media audio to clone a family member’s voice using AI.',
      'Creates extreme panic and gives an excuse why you cannot call their real number directly.',
      'Demands instant, irreversible payment via Zelle, Venmo, or wire transfer.',
    ],
    explanation:
      'AI Voice Cloning Emergency Scam. Always hang up and call your family member’s real phone number directly, or ask for your family safe word.',
    replyOptions: [
      {
        text: 'Send the money via Zelle immediately to help them out of trouble.',
        response: 'Money is wired to an overseas scammer and cannot be recovered.',
        isSafeChoice: false,
      },
      {
        text: 'Text the unknown number back asking to speak to your relative again.',
        response: 'Scammers play another pre-recorded AI voice clip to convince you further.',
        isSafeChoice: false,
      },
      {
        text: 'Hang up and call your relative’s real phone number directly to verify.',
        response: 'Correct! They pick up safe at home. You just defeated an AI voice clone.',
        isSafeChoice: true,
      },
      {
        text: 'Ask the caller for your relative’s birthday to prove who they are.',
        response: 'Unsafe! Birthdays are public online; only a secret family safe word works.',
        isSafeChoice: false,
      },
    ],
    examples: [
      {
        sender: 'Unknown Caller - Sounds like Mom (Ex 1/4)',
        senderHandle: 'No Caller ID • 0:24s',
        timestamp: 'Today, 2:42 PM',
        message:
          '[Audio Transcript]: "Hey sweetie, my phone just died and I got into a minor fender bender. I’m using the tow truck driver’s phone. Can you Zelle $380 to (704) 555-0148 right now so he releases the car? Please hurry!"',
      },
      {
        sender: 'Unknown Caller - Sounds like Dad (Ex 2/4)',
        senderHandle: 'Private Number • 0:19s',
        timestamp: 'Today, 4:05 PM',
        message:
          '[Audio Transcript]: "Hey, I dropped my phone in the parking lot and I’m at urgent care getting stitches. My card isn’t reading—can you Apple Cash $250 to the reception desk number at (312) 555-0192?"',
      },
      {
        sender: 'Unknown Caller - Sounds like Sister (Ex 3/4)',
        senderHandle: '+1 (888) 555-0104 • 0:27s',
        timestamp: 'Yesterday, 8:15 PM',
        message:
          '[Audio Transcript]: "I’m freaking out, my bag got stolen at the airport and security won’t let me board without a $420 emergency re-booking fee. Don’t call my cell, the thief has it! Venmo @airport-agent-desk99 now!"',
      },
      {
        sender: 'Unknown Caller - Sounds like Brother (Ex 4/4)',
        senderHandle: 'No Caller ID • 0:22s',
        timestamp: '2 days ago',
        message:
          '[Audio Transcript]: "Bro, my car broke down on the highway and my phone has 1% battery. The mechanic only takes Zelle—send $310 to (415) 555-0133 right now or I’m stranded overnight!"',
      },
    ],
  },

  // TYPE 3: University & Student Phishing (4 Examples)
  {
    typeId: '3',
    scamType: 'Type 3: School & Tuition Phishing',
    channel: 'Email',
    isScam: true,
    difficulty: 'Medium',
    redFlags: [
      'Sender address uses a fake ".org" or ".com" domain instead of your official ".edu" school domain.',
      'Threatens forfeited grants, holds, or penalties within 24 hours.',
      'Harvests your school NetID login to hijack financial aid direct deposits.',
    ],
    explanation:
      'College & Student Portal Phishing. Always log into your school portal directly by typing the official .edu address yourself.',
    replyOptions: [
      {
        text: 'Click the portal link and log in quickly so you don’t get penalized.',
        response: 'Credential Harvested! Scammers hijack your school portal and reroute your refund.',
        isSafeChoice: false,
      },
      {
        text: 'Reply to the email with your student ID number asking for help.',
        response: 'Trap! You just handed personal academic records to a phishing operator.',
        isSafeChoice: false,
      },
      {
        text: 'Forward the email to campus IT security and check your official .edu portal.',
        response: 'Correct! Reporting protects classmates while keeping your NetID safe.',
        isSafeChoice: true,
      },
      {
        text: 'Click the link and type a fake password just to test if it’s real.',
        response: 'Risky! Simply visiting the URL can trigger drive-by tracking scripts.',
        isSafeChoice: false,
      },
    ],
    examples: [
      {
        sender: 'University Financial Aid (Ex 1/4)',
        senderHandle: 'aid-disbursement@student-portal-verify.org',
        timestamp: 'Yesterday, 4:15 PM',
        subject: 'URGENT: Fall Tuition Grant Refund Pending ($1,450.00)',
        message:
          'Dear Student,\n\nYour $1,450.00 tuition grant refund is ready, but your bank routing profile is outdated. Sign in with your NetID within 24 hours or your grant will be forfeited.',
        hasLink: true,
        linkDestinationUrl: 'https://student-portal-verify.org/login',
      },
      {
        sender: 'Campus Parking Enforcement (Ex 2/4)',
        senderHandle: 'citations@campus-parking-appeals.com',
        timestamp: '2 days ago',
        subject: 'FINAL WARNING: Unpaid Campus Parking Citation #8841 ($75.00)',
        message:
          'A hold will be placed on your graduation and class registration tomorrow unless Citation #8841 is paid online immediately via our student portal link.',
        hasLink: true,
        linkDestinationUrl: 'https://campus-parking-appeals.com/pay',
      },
      {
        sender: 'University Library Services (Ex 3/4)',
        senderHandle: 'overdue@uni-library- fines-portal.net',
        timestamp: '3 days ago',
        subject: 'Account Suspension: Overdue Equipment Fee ($140.00)',
        message:
          'Your student ID badge and Wi-Fi access will be deactivated at 5:00 PM today due to unreturned lab equipment. Log in below to clear or dispute this charge.',
        hasLink: true,
        linkDestinationUrl: 'https://uni-library-fines-portal.net/login',
      },
      {
        sender: 'FAFSA Verification Desk (Ex 4/4)',
        senderHandle: 'compliance@fafsa-student-grant-review.org',
        timestamp: '4 days ago',
        subject: 'Action Required: Federal Student Aid Eligibility Audit',
        message:
          'Your federal scholarship eligibility is paused pending SSN and NetID verification. Upload your details at our secure portal within 12 hours.',
        hasLink: true,
        linkDestinationUrl: 'https://fafsa-student-grant-review.org/audit',
      },
    ],
  },

  // TYPE 4: Legitimate Security Alerts - SAFE (4 Examples)
  {
    typeId: '4',
    scamType: 'Type 4: Real Security Alerts (Safe)',
    channel: 'SMS Text',
    isScam: false,
    difficulty: 'Medium',
    redFlags: [
      'NO RED FLAGS — This is a legitimate security notification!',
      'Sent from an official 5-digit short code and contains NO sketchy external links.',
      'Explicitly reminds you NEVER to share your passcode or PIN with anyone.',
    ],
    explanation:
      'Not every alert is a scam! Real banks and 2FA systems use verified short codes, ask simple YES/NO questions, and never ask for your password or PIN.',
    replyOptions: [
      {
        text: 'Ignore it completely because all security texts are probably scams.',
        response: 'Careful! Ignoring a real fraud alert could leave unauthorized charges unblocked.',
        isSafeChoice: false,
      },
      {
        text: 'Follow the safe instruction (reply YES/NO or use the official app directly).',
        response: 'Correct! Verified short-code alerts without links are safe to use.',
        isSafeChoice: true,
      },
      {
        text: 'Reply with your full password and SSN just in case.',
        response: 'Never text passwords or SSNs—even to legitimate automated numbers!',
        isSafeChoice: false,
      },
      {
        text: 'Post a screenshot of your security code on social media.',
        response: 'Dangerous! Never share active 2FA codes or card digits publicly.',
        isSafeChoice: false,
      },
    ],
    examples: [
      {
        sender: 'Chase Fraud Prevention (Ex 1/4)',
        senderHandle: '72166',
        timestamp: 'Yesterday, 6:05 PM',
        message:
          'Chase Fraud Alert: Did you attempt a $412.50 purchase at ELECTRONICS HUB MIAMI FL on card ending in 4821? Reply YES or NO. Never share your passcode with anyone.',
      },
      {
        sender: 'American Express Security (Ex 2/4)',
        senderHandle: '86509',
        timestamp: '2 days ago',
        message:
          'Amex Free Msg: We declined a $890.00 charge at LUXURY WATCHES ONLINE on card ending 1004. If you recognize this, reply 1. If not, open your Amex app to replace your card.',
      },
      {
        sender: 'Google 2-Step Verification (Ex 3/4)',
        senderHandle: '22000',
        timestamp: '3 days ago',
        message:
          'G-582910 is your Google verification code. Do not share this code with anyone. Google will never call or text you to ask for this code.',
      },
      {
        sender: 'Bank of America Alerts (Ex 4/4)',
        senderHandle: '692632',
        timestamp: '4 days ago',
        message:
          'BofA: Your scheduled transfer of $50.00 to Savings Account ending in 9912 was completed today. Check your official BofA mobile app for balance details.',
      },
    ],
  },

  // TYPE 5: Fake Job & Influencer Overpayment (4 Examples)
  {
    typeId: '5',
    scamType: 'Type 5: Fake Check Job Scams',
    channel: 'DM / Social',
    isScam: true,
    difficulty: 'Medium',
    redFlags: [
      'The "Fake Check Overpayment" trick: sending a check and asking you to Venmo or Zelle money back.',
      'Banks make check funds appear in 24 hours, but fake checks bounce 5–7 days later.',
      'Real employers never tell you to pay their vendors or graphic designers out of your own account.',
    ],
    explanation:
      'Influencer & Remote Job Overpayment Scam—the #1 financial scam targeting teens and college students on Instagram and TikTok.',
    replyOptions: [
      {
        text: 'Mobile-deposit the check and Venmo the requested amount back.',
        response: 'The check bounces in 5 days! Your bank deducts the full amount and flags your account.',
        isSafeChoice: false,
      },
      {
        text: 'Reply: "Can I keep an extra $100 for my time?"',
        response: 'Scammers will promise you anything because the check is 100% counterfeit.',
        isSafeChoice: false,
      },
      {
        text: 'Block the account and report the profile for job fraud.',
        response: 'Correct! Legitimate jobs never send checks requiring you to wire money back.',
        isSafeChoice: true,
      },
      {
        text: 'Forward the recruiter to your friends so they can apply too.',
        response: 'Unsafe! You could accidentally expose your friends to bank fraud.',
        isSafeChoice: false,
      },
    ],
    examples: [
      {
        sender: 'Campus Brand Recruiter (Ex 1/4)',
        senderHandle: '@stella_talent_recruiting',
        timestamp: '2 days ago',
        message:
          'Hey! We want to pay you $300/week as a brand ambassador! We emailed you a $500 check for starter gear—mobile deposit it today and Venmo $200 back to our graphic designer!',
      },
      {
        sender: 'Remote Data Entry HR (Ex 2/4)',
        senderHandle: '@global_remote_careers',
        timestamp: '3 days ago',
        message:
          'You’re hired as our remote student assistant ($35/hr)! We are sending a $1,200 e-check for your MacBook setup. Deposit it now and Zelle $800 to our IT supplier to ship your laptop.',
      },
      {
        sender: 'TikTok Creator Collabs (Ex 3/4)',
        senderHandle: '@viral_collab_agency',
        timestamp: '4 days ago',
        message:
          'We loved your recent post! Our sponsor sent a $750 check by email, but accidentally overpaid by $300. Deposit the check and CashApp the $300 difference back to lock in your deal!',
      },
      {
        sender: 'Pet Sitter Match (Ex 4/4)',
        senderHandle: '@luxury_petcare_hiring',
        timestamp: '5 days ago',
        message:
          'Hi! I’m moving to your area next week and paying $400 upfront for dog walking. I emailed a $900 cashier’s check—please deposit it and wire $500 to my pet mover today!',
      },
    ],
  },

  // TYPE 6: Crypto & Web3 Wallet Drainers (4 Examples)
  {
    typeId: '6',
    scamType: 'Type 6: Crypto & Giveaway Drainers',
    channel: 'DM / Social',
    isScam: true,
    difficulty: 'Hard (AI Era)',
    redFlags: [
      'Unsolicited DMs claiming you won thousands in crypto or prizes out of nowhere.',
      'Directs you to a malicious web portal asking to connect your wallet or enter login info.',
      'Approving a malicious smart contract drains all assets in a single click.',
    ],
    explanation:
      'Crypto Drainer & Giveaway Scam. Never connect digital wallets or accounts to unsolicited giveaway links in DMs.',
    replyOptions: [
      {
        text: 'Click the link and connect your account to claim the free prize.',
        response: 'Account Drained! Malicious permissions immediately empty your balance.',
        isSafeChoice: false,
      },
      {
        text: 'Reply: "Send me proof that other winners got paid."',
        response: 'Scammers reply with AI-generated screenshots of fake payouts.',
        isSafeChoice: false,
      },
      {
        text: 'Block the sender, report spam, and never click unsolicited prize links.',
        response: 'Correct! Random DMs promising free money are always traps.',
        isSafeChoice: true,
      },
      {
        text: 'Type your recovery phrase into their support chat so they can deposit it.',
        response: 'Never share recovery phrases or passwords—that hands over 100% control.',
        isSafeChoice: false,
      },
    ],
    examples: [
      {
        sender: 'Crypto Giveaways Official (Ex 1/4)',
        senderHandle: '@eth_airdrop_2026',
        timestamp: '3 days ago',
        message:
          'CONGRATS! You were selected to receive 2.5 Ethereum (~$6,500)! Connect your wallet to our claim portal before the smart contract expires: https://eth-airdrop-claim-tokens.net',
        hasLink: true,
        linkDestinationUrl: 'https://eth-airdrop-claim-tokens.net',
      },
      {
        sender: 'Solana NFT Launchpad (Ex 2/4)',
        senderHandle: '@sol_vip_mint',
        timestamp: '4 days ago',
        message:
          'You won a free VIPWhitelist NFT worth $1,800! Approve the claim transaction on our portal within 30 minutes: https://solana-free-mint-drop.org',
        hasLink: true,
        linkDestinationUrl: 'https://solana-free-mint-drop.org',
      },
      {
        sender: 'MetaMask Support Bot (Ex 3/4)',
        senderHandle: '@metamask_security_sync',
        timestamp: '5 days ago',
        message:
          'URGENT: Your wallet will be restricted due to new KYC rules. Synchronize your seed phrase immediately at: https://metamask-kyc-sync-node.com',
        hasLink: true,
        linkDestinationUrl: 'https://metamask-kyc-sync-node.com',
      },
      {
        sender: 'MrBeast Giveaway Bot (Ex 4/4)',
        senderHandle: '@mrbeast_cash_prize_official',
        timestamp: '6 days ago',
        message:
          'You commented on our video and won $2,500! Pay the $9.99 instant verification fee at our sponsor link to release your payout: https://beast-prize-verify.info',
        hasLink: true,
        linkDestinationUrl: 'https://beast-prize-verify.info',
      },
    ],
  },

  // TYPE 7: Subscription Billing Phishing (4 Examples)
  {
    typeId: '7',
    scamType: 'Type 7: Fake Subscription Alerts',
    channel: 'SMS Text',
    isScam: true,
    difficulty: 'Easy',
    redFlags: [
      'Sent from a random phone number instead of an official company short code.',
      'Uses a fake hyphenated domain name (like "netflix-account-update.com").',
      'Pressures you with immediate cancellation today unless you enter a credit card.',
    ],
    explanation:
      'Subscription Phishing Scam. Always open your streaming app or official website directly to check your billing status.',
    replyOptions: [
      {
        text: 'Tap the link and re-enter your debit card so your account stays active.',
        response: 'Card Stolen! Scammers capture your card number and CVV immediately.',
        isSafeChoice: false,
      },
      {
        text: 'Open the official app independently to check your real billing status.',
        response: 'Correct! Your subscription is completely fine. Never trust billing links in texts.',
        isSafeChoice: true,
      },
      {
        text: 'Reply: "I already paid this month, check your records!"',
        response: 'Trap! Replying confirms your number is active and monitored.',
        isSafeChoice: false,
      },
      {
        text: 'Click the link to see if your name is listed on the page.',
        response: 'Unsafe! Phishing links can log your device IP and browser data.',
        isSafeChoice: false,
      },
    ],
    examples: [
      {
        sender: 'Netflix Billing Dept (Ex 1/4)',
        senderHandle: '+1 (555) 019-8231',
        timestamp: '4 days ago',
        message:
          'Netflix: Your monthly subscription payment failed. Your account will be suspended today unless you update payment info: https://netflix-account-update-billing.com',
        hasLink: true,
        linkDestinationUrl: 'https://netflix-account-update-billing.com',
      },
      {
        sender: 'Spotify Premium Support (Ex 2/4)',
        senderHandle: '+1 (646) 555-0144',
        timestamp: '5 days ago',
        message:
          'Spotify Alert: Your Student Premium renewal was declined. Update your card within 6 hours or lose your saved playlists: https://spotify-billing-renew.net',
        hasLink: true,
        linkDestinationUrl: 'https://spotify-billing-renew.net',
      },
      {
        sender: 'Disney+ Member Services (Ex 3/4)',
        senderHandle: '+1 (818) 555-0173',
        timestamp: '6 days ago',
        message:
          'Disney+: We could not process your $13.99 monthly bundle. Verify your payment method now to avoid cancellation: https://disneyplus-verify-card.org',
        hasLink: true,
        linkDestinationUrl: 'https://disneyplus-verify-card.org',
      },
      {
        sender: 'Apple iCloud Storage (Ex 4/4)',
        senderHandle: '+1 (408) 555-0129',
        timestamp: '1 week ago',
        message:
          'iCloud Notice: Your 2TB photos backup will be permanently deleted in 24 hours due to an expired card. Renew here: https://icloud-storage-pay-portal.com',
        hasLink: true,
        linkDestinationUrl: 'https://icloud-storage-pay-portal.com',
      },
    ],
  },

  // TYPE 8: Fake Invoice & Tech Support Refund (4 Examples)
  {
    typeId: '8',
    scamType: 'Type 8: Fake Invoice Refund Scams',
    channel: 'Email',
    isScam: true,
    difficulty: 'Medium',
    redFlags: [
      'Claims you were charged $300–$500 for an antivirus or tech plan you never bought.',
      'Pushes you to call a fake "cancellation helpline" phone number in panic.',
      'When you call, scammers trick you into installing remote-control software to steal bank funds.',
    ],
    explanation:
      'Tech Support Refund Scam. No charge actually occurred—the fake invoice is bait to make you call their scam call center.',
    replyOptions: [
      {
        text: 'Call the phone number in the email immediately to demand a refund.',
        response: 'Trap! Scammers answer pretending to be support and trick you into giving remote access.',
        isSafeChoice: false,
      },
      {
        text: 'Check your real bank statement independently and report the email as phishing.',
        response: 'Correct! Your real bank statement shows $0 charged. It was a phantom invoice.',
        isSafeChoice: true,
      },
      {
        text: 'Reply to the email with your bank account number so they can refund it.',
        response: 'Dangerous! Never email financial details to unknown senders.',
        isSafeChoice: false,
      },
      {
        text: 'Install the remote support app they recommend to cancel the subscription.',
        response: 'Never install remote desktop software for unsolicited support callers!',
        isSafeChoice: false,
      },
    ],
    examples: [
      {
        sender: 'Geek Squad Billing (Ex 1/4)',
        senderHandle: 'billing@geek-squad-renewals-support.info',
        timestamp: '5 days ago',
        subject: 'INVOICE: Annual Total Protection Auto-Renewal ($349.99)',
        message:
          'Thank you for renewing Geek Squad Total Protection. $349.99 will appear on your statement. To CANCEL and claim an instant REFUND, call +1 (888) 555-0199 now.',
      },
      {
        sender: 'Norton LifeLock Billing (Ex 2/4)',
        senderHandle: 'invoices@norton-auto-debit-center.org',
        timestamp: '6 days ago',
        subject: 'Order Confirmation #NL-9021: $299.00 Charged Today',
        message:
          'Your 2-year Norton 360 Deluxe plan has auto-renewed for $299.00. If you did not authorize this charge, call our Refund Department at +1 (800) 555-0142.',
      },
      {
        sender: 'McAfee Security Desk (Ex 3/4)',
        senderHandle: 'auto-pay@mcafee-subscription-billing.net',
        timestamp: '1 week ago',
        subject: 'Receipt for McAfee Total PC Shield ($419.99)',
        message:
          'We billed $419.99 to your card on file. Call +1 (877) 555-0165 within 12 hours if you wish to void this transaction and receive a full reimbursement.',
      },
      {
        sender: 'PayPal Crypto Checkout (Ex 4/4)',
        senderHandle: 'service-receipt@paypal-crypto-orders.info',
        timestamp: '1 week ago',
        subject: 'You sent $485.00 USD to Coinbase Digital LLC',
        message:
          'Your PayPal account was charged $485.00 for Bitcoin purchase #BTC-883. If this was not you, call our Fraud Dispute Line immediately at +1 (855) 555-0188.',
      },
    ],
  },

  // TYPE 9: Account Takeover & Cloud Phishing (4 Examples)
  {
    typeId: '9',
    scamType: 'Type 9: Account Takeover Phishing',
    channel: 'SMS Text',
    isScam: true,
    difficulty: 'Medium',
    redFlags: [
      'Uses scary foreign login locations or copyright threats to trigger instant panic.',
      'Links to a fake login page ("appleid.support-icloud-login.com") instead of the real platform.',
      'Real security alerts can always be verified inside your native phone Settings or app.',
    ],
    explanation:
      'Account Takeover Phishing. Scammers use fear to make you type your password and 2FA code into a fake login screen.',
    replyOptions: [
      {
        text: 'Click the link and sign in immediately to block the foreign hacker.',
        response: 'Account Hijacked! You just typed your real password into a scammer’s form.',
        isSafeChoice: false,
      },
      {
        text: 'Open your device Settings or official app directly to check active devices.',
        response: 'Correct! Checking natively shows no unauthorized logins.',
        isSafeChoice: true,
      },
      {
        text: 'Reply with your current password so support can lock the account.',
        response: 'Never send passwords via SMS—support teams will never ask for them.',
        isSafeChoice: false,
      },
      {
        text: 'Click the link on a computer instead of your phone.',
        response: 'Still dangerous! A phishing site steals your password on any device.',
        isSafeChoice: false,
      },
    ],
    examples: [
      {
        sender: 'Apple Security Alert (Ex 1/4)',
        senderHandle: 'Alert-System',
        timestamp: '6 days ago',
        message:
          'Apple ID Alert: Your iPhone was used to sign in from a new device in Beijing, China. If this was NOT you, secure your account immediately: https://appleid.support-icloud-login.com',
        hasLink: true,
        linkDestinationUrl: 'https://appleid.support-icloud-login.com',
      },
      {
        sender: 'Instagram Copyright Center (Ex 2/4)',
        senderHandle: '+1 (415) 555-0190',
        timestamp: '1 week ago',
        message:
          'Meta Notice: Your Instagram account will be permanently deleted in 24 hours due to a copyright violation. Submit an appeal here: https://ig-copyright-appeal-center.com',
        hasLink: true,
        linkDestinationUrl: 'https://ig-copyright-appeal-center.com',
      },
      {
        sender: 'Google Account Security (Ex 3/4)',
        senderHandle: '+1 (650) 555-0138',
        timestamp: '1 week ago',
        message:
          'Google Alert: Someone in Moscow attempted to reset your Gmail password. Cancel this request now: https://accounts-google-security-cancel.net',
        hasLink: true,
        linkDestinationUrl: 'https://accounts-google-security-cancel.net',
      },
      {
        sender: 'Snapchat Trust & Safety (Ex 4/4)',
        senderHandle: '+1 (310) 555-0155',
        timestamp: '2 weeks ago',
        message:
          'Snapchat Warning: Multiple login attempts detected on your account. Verify your login credentials now or lose your Memories: https://snapchat-verify-memories.org',
        hasLink: true,
        linkDestinationUrl: 'https://snapchat-verify-memories.org',
      },
    ],
  },

  // TYPE 10: Government, Toll & Utility Extortion (4 Examples)
  {
    typeId: '10',
    scamType: 'Type 10: Utility & Toll Extortion',
    channel: 'SMS Text',
    isScam: true,
    difficulty: 'Easy',
    redFlags: [
      'Threatens immediate utility shutoff, license suspension, or arrest within hours.',
      'Demands payment via Zelle, gift cards, crypto, or a sketchy ".com" toll link.',
      'Government agencies and utilities always send official notices and can be verified via official phone numbers.',
    ],
    explanation:
      'Utility & Toll Extortion Scam. Always verify balances by calling the number on your official bill or state .gov website.',
    replyOptions: [
      {
        text: 'Pay the balance immediately via the link or Zelle to avoid penalties.',
        response: 'Money Stolen! Scammers pocket the payment and you never owed anything.',
        isSafeChoice: false,
      },
      {
        text: 'Check your official utility bill or state .gov website independently.',
        response: 'Correct! Your real account balance is $0. You spotted the extortion scam.',
        isSafeChoice: true,
      },
      {
        text: 'Reply asking if you can pay half today and half tomorrow.',
        response: 'Trap! Scammers will gladly take partial payments and demand more later.',
        isSafeChoice: false,
      },
      {
        text: 'Reply with your driver’s license number to look up the record.',
        response: 'Identity Theft Risk! Never text government ID numbers to unknown senders.',
        isSafeChoice: false,
      },
    ],
    examples: [
      {
        sender: 'Local Electric Utility (Ex 1/4)',
        senderHandle: 'Power-Notice',
        timestamp: '1 week ago',
        message:
          'FINAL NOTICE: Your electricity will be disconnected in 2 hours due to an overdue balance of $128.40. Pay now via Zelle to avoid immediate shutoff.',
      },
      {
        sender: 'NC Quick Pass / E-ZPass (Ex 2/4)',
        senderHandle: '+1 (919) 555-0177',
        timestamp: '1 week ago',
        message:
          'State Toll Alert: You have an unpaid toll invoice of $6.80. Pay within 12 hours to avoid a $75.00 DMV registration suspension fee: https://ezpass-toll-invoice-pay.com',
        hasLink: true,
        linkDestinationUrl: 'https://ezpass-toll-invoice-pay.com',
      },
      {
        sender: 'IRS Tax Enforcement (Ex 3/4)',
        senderHandle: '+1 (202) 555-0149',
        timestamp: '2 weeks ago',
        message:
          'IRS WARRANT NOTICE: You have an unpaid federal tax penalty of $490.00. Failure to settle via our portal today will result in a warrant: https://irs-tax-settlement-portal.org',
        hasLink: true,
        linkDestinationUrl: 'https://irs-tax-settlement-portal.org',
      },
      {
        sender: 'County Court Clerk (Ex 4/4)',
        senderHandle: '+1 (704) 555-0162',
        timestamp: '2 weeks ago',
        message:
          'COURT SUMMONS: You missed mandatory Jury Duty yesterday. Pay the $250.00 civil contempt bond online immediately to cancel your bench warrant: https://county-jury-bond-pay.net',
        hasLink: true,
        linkDestinationUrl: 'https://county-jury-bond-pay.net',
      },
    ],
  },
];

// Automatically flattens the 10 Types x 4 Examples into all 40 playable simulations!
export const SCENARIOS: ScamScenario[] = SCENARIO_TEMPLATES.flatMap((template) =>
  template.examples.map((ex, idx) => ({
    id: `${template.typeId}-${idx + 1}`,
    scamType: template.scamType,
    channel: template.channel,
    sender: ex.sender,
    senderHandle: ex.senderHandle,
    timestamp: ex.timestamp,
    subject: ex.subject,
    message: ex.message,
    isScam: template.isScam,
    difficulty: template.difficulty,
    redFlags: template.redFlags,
    explanation: template.explanation,
    replyOptions: template.replyOptions,
    hasLink: ex.hasLink,
    linkDestinationUrl: ex.linkDestinationUrl,
  }))
);