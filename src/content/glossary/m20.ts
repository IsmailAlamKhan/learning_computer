import type { GlossaryEntry } from '../../engine/types'

const entries: GlossaryEntry[] = [
  { id: 'code-tag', termBn: 'ট্যাগ', termEn: 'Tag', icon: '🏷️', art: 'html-tag', meaningBn: 'HTML-এ < > চিহ্নের ভেতরের নাম, যেমন <p>। বেশিরভাগ ট্যাগ খোলা (<p>) আর বন্ধ (</p>) জোড়ায় আসে।', module: 20 },
  { id: 'code-element', termBn: 'এলিমেন্ট', termEn: 'Element', icon: '🧱', meaningBn: 'খোলার ট্যাগ, মাঝের লেখা আর বন্ধের ট্যাগ মিলিয়ে পুরো অংশ, যেমন <p>স্বাগতম</p>।', module: 20 },
  { id: 'code-attribute', termBn: 'অ্যাট্রিবিউট', termEn: 'Attribute', icon: '🔖', meaningBn: 'ট্যাগের বাড়তি তথ্য, name="value" আকারে। যেমন লিংকের href বা ছবির alt।', module: 20 },
  { id: 'code-heading', termBn: 'শিরোনাম', termEn: 'Heading', icon: '🔠', meaningBn: 'পাতার বড় লেখা। <h1> সবচেয়ে বড়, তারপর <h2>, <h3> ক্রমে ছোট।', module: 20 },
  { id: 'code-paragraph', termBn: 'অনুচ্ছেদ', termEn: 'Paragraph', icon: '📝', meaningBn: 'সাধারণ লেখার একটি খণ্ড। HTML-এ <p> ও </p> ট্যাগের মাঝে লেখা হয়।', module: 20 },
  { id: 'code-list', termBn: 'তালিকা', termEn: 'List', icon: '📋', meaningBn: 'বুলেট দেওয়া আইটেমের সারি। পুরো তালিকা <ul>, প্রতিটি আইটেম <li>।', module: 20 },
  { id: 'code-link', termBn: 'লিংক', termEn: 'Link', icon: '🔗', art: 'link', meaningBn: 'যে লেখায় ক্লিক করলে অন্য পাতায় যাওয়া যায়। লেখা হয় <a href="ঠিকানা">লেখা</a>।', module: 20 },
  { id: 'code-image', termBn: 'ছবি (HTML)', termEn: 'Image', icon: '🖼️', art: 'image', meaningBn: 'ওয়েবপেজে ছবি দেখানোর ট্যাগ <img src="ফাইল" alt="বর্ণনা">। বন্ধের ট্যাগ লাগে না।', module: 20 },
  { id: 'code-alt', termBn: 'alt টেক্সট', termEn: 'Alt text', icon: '♿', meaningBn: 'ছবির ছোট বর্ণনা। ছবি না এলে এটি দেখা যায়, আর স্ক্রিন-রিডার এটি পড়ে শোনায়।', module: 20 },
  { id: 'code-utf8', termBn: 'UTF-8', termEn: 'UTF-8', icon: '🔤', art: 'language', meaningBn: 'লেখা সেভ করার নিয়ম, যাতে বাংলাসহ প্রায় সব ভাষার অক্ষর ঠিক থাকে। <meta charset="utf-8"> দিয়ে জানানো হয়।', module: 20 },
  { id: 'code-css', termBn: 'সিএসএস', termEn: 'CSS', icon: '🎨', art: 'css-brush', meaningBn: 'পাতা দেখতে কেমন হবে তার ভাষা: রং, আকার, ফাঁকা জায়গা। থাকে আলাদা style.css ফাইলে।', module: 20 },
  { id: 'code-selector', termBn: 'সিলেক্টর', termEn: 'Selector', icon: '🎯', meaningBn: 'CSS-এ কাকে সাজাব তার নাম, যেমন h1 বা p। এর পর { } বন্ধনীতে নিয়মগুলো লেখা হয়।', module: 20 },
  { id: 'code-property', termBn: 'প্রপার্টি', termEn: 'Property', icon: '🎛️', meaningBn: 'CSS-এ কী বদলাব তার নাম, যেমন color বা font-size।', module: 20 },
  { id: 'code-value', termBn: 'ভ্যালু', termEn: 'Value', icon: '🎚️', meaningBn: 'প্রপার্টির মান, যেমন color: teal; লাইনের teal।', module: 20 },
  { id: 'code-variable', termBn: 'ভেরিয়েবল', termEn: 'Variable', icon: '📦', art: 'package-box', meaningBn: 'নাম-লেখা বাক্স, যেখানে কিছু জমা রাখা যায়। name = "Rumi" মানে name বাক্সে Rumi।', module: 20 },
  { id: 'code-string', termBn: 'স্ট্রিং', termEn: 'String', icon: '💬', meaningBn: 'কোটেশনের ভেতরের লেখা, যেমন "Hello" বা "স্বাগতম"। প্রোগ্রামে লেখা এভাবেই রাখতে হয়।', module: 20 },
  { id: 'code-integer', termBn: 'পূর্ণসংখ্যা', termEn: 'Integer', icon: '🔢', meaningBn: 'দশমিক ছাড়া সংখ্যা, যেমন ৫ বা ১৮। লেখাকে সংখ্যা বানাতে int(…) লাগে।', module: 20 },
  { id: 'code-input', termBn: 'ইনপুট', termEn: 'Input', icon: '⌨️', meaningBn: 'প্রোগ্রাম চলার সময় ব্যবহারকারীর কাছ থেকে নেওয়া তথ্য। পাইথনে input("প্রশ্ন") দিয়ে নেওয়া হয়।', module: 20 },
  { id: 'code-print', termBn: 'প্রিন্ট', termEn: 'Print', icon: '🖨️', meaningBn: 'প্রোগ্রামের পর্দায় কিছু দেখানো। পাইথনে print("…") দিয়ে করা হয়।', module: 20 },
  { id: 'code-operator', termBn: 'অপারেটর', termEn: 'Operator', icon: '➕', meaningBn: 'হিসাব বা তুলনার চিহ্ন, যেমন + - * / ** আর >= ==।', module: 20 },
  { id: 'code-condition', termBn: 'শর্ত', termEn: 'Condition', icon: '❓', art: 'branch', meaningBn: 'সত্য না মিথ্যা দেখে প্রোগ্রাম সিদ্ধান্ত নেয়। if age >= 18: লাইনে age >= 18 হলো শর্ত।', module: 20 },
  { id: 'code-loop', termBn: 'লুপ', termEn: 'Loop', icon: '🔁', art: 'loop', meaningBn: 'একই কাজ বারবার করানো। for i in range(3): মানে ভেতরের কাজ তিনবার।', module: 20 },
  { id: 'code-indentation', termBn: 'ইন্ডেন্টেশন', termEn: 'Indentation', icon: '↹', meaningBn: 'লাইন ডানে সরিয়ে লেখা। পাইথনে এটি বোঝায় লাইনটি ওপরের if বা for-এর ভেতরের কাজ।', module: 20 },
  { id: 'code-comment', termBn: 'মন্তব্য', termEn: 'Comment', icon: '🗒️', meaningBn: 'কোডে নিজের নোট, যা চালানো হয় না। পাইথনে # দিয়ে, HTML-এ <!-- … --> দিয়ে লেখা হয়।', module: 20 },
  { id: 'code-run', termBn: 'চালানো', termEn: 'Run', icon: '▶️', meaningBn: 'লেখা প্রোগ্রামকে কাজ করতে বলা। কোড এডিটরে সবুজ ▶ Run বোতাম চাপলে হয়।', module: 20 },
  { id: 'code-output', termBn: 'আউটপুট', termEn: 'Output', icon: '📤', meaningBn: 'প্রোগ্রাম চলার পর যা পর্দায় ছাপা হয়ে আসে।', module: 20 },
  { id: 'code-error', termBn: 'এরর', termEn: 'Error', icon: '⚠️', art: 'warning', meaningBn: 'প্রোগ্রাম আটকে গেলে কম্পিউটারের দেওয়া বার্তা। সাধারণত বলা থাকে কোন লাইনে কী হয়েছে।', module: 20 },
  { id: 'code-bug', termBn: 'বাগ', termEn: 'Bug', icon: '🐞', art: 'bug', meaningBn: 'কোডের ভুল। বাগ খুঁজে সারানো প্রোগ্রামারদের রোজকার স্বাভাবিক কাজ।', module: 20 },
]

export default entries
