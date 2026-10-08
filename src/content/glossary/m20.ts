import type { GlossaryEntry } from '../../engine/types'

const entries: GlossaryEntry[] = [
  { id: 'code-tag', termBn: 'ট্যাগ', termEn: 'Tag', meaningBn: 'HTML-এ < আর > চিহ্নের ভেতরের নাম, যেমন <p>। বেশিরভাগ ট্যাগ খোলার (<p>) আর বন্ধের (</p>) জোড়ায় আসে।', module: 20 },
  { id: 'code-element', termBn: 'এলিমেন্ট', termEn: 'Element', meaningBn: 'খোলার ট্যাগ, মাঝের লেখা আর বন্ধের ট্যাগ মিলিয়ে পুরো অংশ, যেমন <p>স্বাগতম</p>।', module: 20 },
  { id: 'code-attribute', termBn: 'অ্যাট্রিবিউট', termEn: 'Attribute', meaningBn: 'ট্যাগের অতিরিক্ত তথ্য, name="value" আকারে। যেমন লিংকের href="…" বা ছবির alt="…"।', module: 20 },
  { id: 'code-heading', termBn: 'শিরোনাম', termEn: 'Heading', meaningBn: 'পাতার বড় লেখা। HTML-এ <h1> সবচেয়ে বড়, তারপর <h2>, <h3> ক্রমে ছোট।', module: 20 },
  { id: 'code-paragraph', termBn: 'অনুচ্ছেদ', termEn: 'Paragraph', meaningBn: 'সাধারণ লেখার একটি খণ্ড। HTML-এ <p> ও </p> ট্যাগের মাঝে লেখা হয়।', module: 20 },
  { id: 'code-list', termBn: 'তালিকা', termEn: 'List', meaningBn: 'বুলেট দেওয়া আইটেমের সারি। HTML-এ পুরো তালিকা <ul>, প্রতিটি আইটেম <li>।', module: 20 },
  { id: 'code-link', termBn: 'লিংক', termEn: 'Link', meaningBn: 'যে লেখায় ক্লিক করলে অন্য পাতায় যাওয়া যায়। HTML-এ <a href="ঠিকানা">লেখা</a> আকারে লেখা হয়।', module: 20 },
  { id: 'code-image', termBn: 'ছবি (HTML)', termEn: 'Image', meaningBn: 'ওয়েবপেজে ছবি দেখানোর ট্যাগ <img src="ছবির-ফাইল" alt="বর্ণনা">। এর বন্ধের ট্যাগ লাগে না।', module: 20 },
  { id: 'code-alt', termBn: 'alt টেক্সট', termEn: 'Alt text', meaningBn: 'ছবির ছোট বর্ণনা। ছবি না এলে সেই জায়গায় এই লেখা দেখা যায়, আর চোখে না দেখা মানুষের স্ক্রিন-রিডারও এটি পড়ে শোনায়।', module: 20 },
  { id: 'code-utf8', termBn: 'UTF-8', termEn: 'UTF-8', meaningBn: 'লেখা সেভ করার একটি নিয়ম, যাতে বাংলাসহ প্রায় সব ভাষার অক্ষর ঠিকঠাক থাকে। HTML-এ <meta charset="utf-8"> দিয়ে ব্রাউজারকে এটি জানানো হয়।', module: 20 },
  { id: 'code-css', termBn: 'সিএসএস', termEn: 'CSS', meaningBn: 'পাতা দেখতে কেমন হবে তা ঠিক করার ভাষা: রং, আকার, ফাঁকা জায়গা। সাধারণত আলাদা style.css ফাইলে লেখা হয়।', module: 20 },
  { id: 'code-selector', termBn: 'সিলেক্টর', termEn: 'Selector', meaningBn: 'CSS-এ কাকে সাজানো হবে তার নাম, যেমন h1 বা p। এর পরে { } বন্ধনীর ভেতরে নিয়মগুলো লেখা হয়।', module: 20 },
  { id: 'code-property', termBn: 'প্রপার্টি', termEn: 'Property', meaningBn: 'CSS-এ কী বদলাতে চাই তার নাম, যেমন color বা font-size।', module: 20 },
  { id: 'code-value', termBn: 'ভ্যালু', termEn: 'Value', meaningBn: 'প্রপার্টিতে কী মান দিতে চাই, যেমন color: teal; লাইনের teal।', module: 20 },
  { id: 'code-variable', termBn: 'ভেরিয়েবল', termEn: 'Variable', meaningBn: 'প্রোগ্রামে নাম দেওয়া বাক্স, যেখানে কিছু জমা রাখা যায়। name = "Rumi" মানে name বাক্সে Rumi রাখা হলো।', module: 20 },
  { id: 'code-string', termBn: 'স্ট্রিং', termEn: 'String', meaningBn: 'কোটেশনের ভেতরের লেখা, যেমন "Hello" বা "স্বাগতম"। প্রোগ্রামে যেকোনো লেখা এভাবে কোটেশনের ভেতরে রাখতে হয়।', module: 20 },
  { id: 'code-integer', termBn: 'পূর্ণসংখ্যা', termEn: 'Integer', meaningBn: 'দশমিক ছাড়া সংখ্যা, যেমন ৫ বা ১৮। পাইথনে লেখাকে সংখ্যায় বদলাতে int(…) ব্যবহার হয়।', module: 20 },
  { id: 'code-input', termBn: 'ইনপুট', termEn: 'Input', meaningBn: 'প্রোগ্রাম চলার সময় ব্যবহারকারীর কাছ থেকে নেওয়া তথ্য। পাইথনে input("প্রশ্ন") দিয়ে নেওয়া হয়।', module: 20 },
  { id: 'code-print', termBn: 'প্রিন্ট', termEn: 'Print', meaningBn: 'প্রোগ্রামের পর্দায় কিছু দেখানো। পাইথনে print("…") দিয়ে করা হয়।', module: 20 },
  { id: 'code-operator', termBn: 'অপারেটর', termEn: 'Operator', meaningBn: 'হিসাব বা তুলনার চিহ্ন, যেমন + - * / ** আর >= ==।', module: 20 },
  { id: 'code-condition', termBn: 'শর্ত', termEn: 'Condition', meaningBn: 'যেটি সত্য না মিথ্যা তা দেখে প্রোগ্রাম সিদ্ধান্ত নেয়। if age >= 18: লাইনে age >= 18 হলো শর্ত।', module: 20 },
  { id: 'code-loop', termBn: 'লুপ', termEn: 'Loop', meaningBn: 'একই কাজ বারবার করানোর ব্যবস্থা। for i in range(3): মানে ভেতরের কাজ তিনবার।', module: 20 },
  { id: 'code-indentation', termBn: 'ইন্ডেন্টেশন', termEn: 'Indentation', meaningBn: 'লাইনের শুরুতে ডান দিকে সরিয়ে লেখা। পাইথনে এটি বোঝায় লাইনটি ওপরের if বা for-এর ভেতরের কাজ।', module: 20 },
  { id: 'code-comment', termBn: 'মন্তব্য', termEn: 'Comment', meaningBn: 'কোডের ভেতরে নিজের নোট, যা প্রোগ্রাম চালায় না। পাইথনে # দিয়ে, HTML-এ <!-- … --> দিয়ে লেখা হয়।', module: 20 },
  { id: 'code-run', termBn: 'চালানো', termEn: 'Run', meaningBn: 'লেখা প্রোগ্রামকে কাজ করতে বলা। কোড এডিটরে সবুজ ▶ Run বোতাম চাপলে এটি হয়।', module: 20 },
  { id: 'code-output', termBn: 'আউটপুট', termEn: 'Output', meaningBn: 'প্রোগ্রাম চলার পর যা পর্দায় ছাপা হয়ে আসে।', module: 20 },
  { id: 'code-error', termBn: 'এরর', termEn: 'Error', meaningBn: 'প্রোগ্রাম চলতে গিয়ে আটকে গেলে কম্পিউটারের দেওয়া বার্তা। কোন লাইনে কী হয়েছে সেটি সাধারণত বলা থাকে।', module: 20 },
  { id: 'code-bug', termBn: 'বাগ', termEn: 'Bug', meaningBn: 'কোডের ভুল। বাগ খুঁজে সারানো প্রোগ্রামারদের রোজকার স্বাভাবিক কাজ।', module: 20 },
]

export default entries
