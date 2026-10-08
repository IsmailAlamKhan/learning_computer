/** Module 18: tiny pure helpers for the "look-alike address" and "tool map" widgets. */

export interface AddressCase {
  id: string
  address: string
  official: boolean
  noteBn: string
}

/** The three official addresses we teach, plus made-up look-alikes (not real sites). */
export const OFFICIAL = ['code.visualstudio.com', 'www.python.org', 'nodejs.org'] as const

export const PYTHON_CASES: AddressCase[] = [
  { id: 'real', address: 'www.python.org', official: true, noteBn: 'ঠিক। python.org — শেষে .org, বানান পুরো মিলছে।' },
  { id: 'zero', address: 'www.pyth0n.org', official: false, noteBn: 'o-এর জায়গায় শূন্য (0)! দেখতে প্রায় এক, কিন্তু আলাদা সাইট।' },
  { id: 'dash', address: 'www.python-download.net', official: false, noteBn: 'নামের সাথে “-download” জুড়ে দেওয়া, আর শেষে .net। আসল ঠিকানা এমন নয়।' },
  { id: 'sub', address: 'python.org.fast-setup.example', official: false, noteBn: 'ঠিকানার নামের অংশটি ডান দিক থেকে পড়ুন: এখানে আসল মালিক fast-setup.example। python.org শুধু তার আগের একটি অংশ, মালিকের নাম নয়।' },
]

/** Positions where `candidate` differs from `official` (aligned by index; extra/missing characters count as differences). */
export function diffPositions(official: string, candidate: string): number[] {
  const out: number[] = []
  const n = Math.max(official.length, candidate.length)
  for (let i = 0; i < n; i++) if (official[i] !== candidate[i]) out.push(i)
  return out
}

export interface ToolCard {
  id: string
  name: string
  roleBn: string
  analogyBn: string
  needNow: boolean
}

export const TOOL_CARDS: ToolCard[] = [
  { id: 'editor', name: 'কোড এডিটর (VS Code)', roleBn: 'কোড লেখার খাতা-কলম।', analogyBn: 'নোটপ্যাড সাধারণ কাগজ হলে এটি দাগ-টানা, রং-করা খাতা — ভুল সহজে ধরা যায়।', needNow: true },
  { id: 'python', name: 'পাইথন (Python)', roleBn: 'পাইথন ভাষায় লেখা প্রোগ্রাম চালানোর যন্ত্র।', analogyBn: 'যে ভাষায় লিখেছেন তা বুঝে কাজ করার অনুবাদক।', needNow: true },
  { id: 'node', name: 'নোড.জেএস (Node.js)', roleBn: 'কম্পিউটারে জাভাস্ক্রিপ্ট চালানোর যন্ত্র।', analogyBn: 'জাভাস্ক্রিপ্ট ভাষার অনুবাদক — ব্রাউজারের বাইরেও।', needNow: true },
  { id: 'git', name: 'গিট (Git)', roleBn: 'কাজের “সেভ পয়েন্ট” জমানোর প্রোগ্রাম।', analogyBn: 'খেলায় যেমন সেভ পয়েন্ট থেকে আবার শুরু করা যায়।', needNow: false },
  { id: 'github', name: 'গিটহাব (GitHub)', roleBn: 'ইন্টারনেটে কোডের কপি রাখার আর ভাগ করার ওয়েবসাইট।', analogyBn: 'অনলাইন আলমারি, যেখানে কপি রাখা আর অন্যকে দেখানো যায়।', needNow: false },
]
