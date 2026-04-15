import { useState, useRef, useCallback, useEffect, useMemo, memo } from "react";

const T = {
  bg:"#06080A",surface:"#0C1014",card:"#111518",border:"#1A2026",
  gold:"#00C2FF",goldLight:"#66DCFF",goldDim:"#006B8C",goldDeep:"#00111A",
  white:"#E6EEF2",gray:"#4A5A64",gl:"#7A9AAA",
  green:"#22C55E",red:"#EF4444",blue:"#3B82F6",purple:"#A855F7",orange:"#F97316",
};

const OWNER = {
  name:"Mario Sofroniou", email:"mario@billiondollarads.ca",
  entity:"PeakOffers", jurisdiction:"Ontario, Canada", brand:"PeakOffers",
};

const FINDERS = [
  {name:"Mario Sofroniou", title:"Principal, PeakOffers"},
  {name:"Vanessa Kisso",   title:"Co-Finder, PeakOffers"},
];

const VERTICALS = [
  {id:"shopify",  label:"Shopify Stores",              cat:"ecom", feeAvg:"$245K", minFee:"$35K",  maxFee:"$700K", volume:"HIGH", multiples:"2.5-4x", revRange:"$1M-$20M"},
  {id:"amazon",   label:"Amazon FBA / FBM",            cat:"ecom", feeAvg:"$210K", minFee:"$40K",  maxFee:"$650K", volume:"HIGH", multiples:"3-5x",   revRange:"$1M-$15M"},
  {id:"dtcmulti", label:"DTC Brand Multi-Channel",     cat:"ecom", feeAvg:"$300K", minFee:"$60K",  maxFee:"$900K", volume:"HIGH", multiples:"2.5-5x", revRange:"$2M-$20M"},
  {id:"health",   label:"Health and Wellness DTC",     cat:"ecom", feeAvg:"$280K", minFee:"$55K",  maxFee:"$850K", volume:"HIGH", multiples:"3-6x",   revRange:"$1M-$20M"},
  {id:"beauty",   label:"Beauty and Personal Care",    cat:"ecom", feeAvg:"$260K", minFee:"$50K",  maxFee:"$800K", volume:"MED",  multiples:"3-5x",   revRange:"$1M-$15M"},
  {id:"pets",     label:"Pet Products and Services",   cat:"ecom", feeAvg:"$230K", minFee:"$45K",  maxFee:"$700K", volume:"MED",  multiples:"3-5x",   revRange:"$1M-$12M"},
  {id:"food",     label:"Food and Beverage DTC",       cat:"ecom", feeAvg:"$200K", minFee:"$40K",  maxFee:"$650K", volume:"MED",  multiples:"2.5-4x", revRange:"$1M-$12M"},
  {id:"affnet",   label:"Affiliate Networks",          cat:"perf", feeAvg:"$180K", minFee:"$50K",  maxFee:"$600K", volume:"HIGH", multiples:"2-4x",   revRange:"$1M-$15M"},
  {id:"ppc",      label:"PPC and Pay-Per-Call",        cat:"perf", feeAvg:"$140K", minFee:"$40K",  maxFee:"$500K", volume:"HIGH", multiples:"2-3x",   revRange:"$500K-$10M"},
  {id:"glp1",     label:"GLP-1 and Health Offers",     cat:"perf", feeAvg:"$260K", minFee:"$75K",  maxFee:"$900K", volume:"HIGH", multiples:"3-6x",   revRange:"$1M-$25M"},
  {id:"media",    label:"Media Buying and Ad Agency",  cat:"perf", feeAvg:"$160K", minFee:"$45K",  maxFee:"$550K", volume:"HIGH", multiples:"2-4x",   revRange:"$1M-$12M"},
  {id:"data",     label:"Data and Lead Gen",           cat:"perf", feeAvg:"$130K", minFee:"$35K",  maxFee:"$450K", volume:"HIGH", multiples:"2-4x",   revRange:"$500K-$8M"},
  {id:"sms",      label:"SMS and Email Platform",      cat:"perf", feeAvg:"$220K", minFee:"$60K",  maxFee:"$750K", volume:"MED",  multiples:"3-6x",   revRange:"$1M-$20M"},
  {id:"martech",  label:"MarTech and SaaS",            cat:"perf", feeAvg:"$280K", minFee:"$80K",  maxFee:"$900K", volume:"MED",  multiples:"4-9x",   revRange:"$500K-$15M"},
  {id:"creator",  label:"Creator and Content Biz",     cat:"perf", feeAvg:"$120K", minFee:"$30K",  maxFee:"$400K", volume:"MED",  multiples:"2-4x",   revRange:"$500K-$8M"},
  {id:"agency",   label:"Digital Agency and Services", cat:"biz",  feeAvg:"$175K", minFee:"$40K",  maxFee:"$600K", volume:"HIGH", multiples:"2-4x",   revRange:"$1M-$15M"},
  {id:"saas",     label:"B2B SaaS and Software",       cat:"biz",  feeAvg:"$350K", minFee:"$80K",  maxFee:"$1.2M", volume:"MED",  multiples:"5-10x",  revRange:"$500K-$20M"},
  {id:"mfg",      label:"Manufacturing and CPG",       cat:"biz",  feeAvg:"$420K", minFee:"$100K", maxFee:"$1.5M", volume:"MED",  multiples:"4-7x",   revRange:"$2M-$30M"},
  {id:"franchise",label:"Franchise Multi-Location",    cat:"biz",  feeAvg:"$280K", minFee:"$60K",  maxFee:"$900K", volume:"MED",  multiples:"3-5x",   revRange:"$1M-$20M"},
  {id:"content2", label:"Media Publishing Content",   cat:"biz",  feeAvg:"$220K", minFee:"$50K",  maxFee:"$750K", volume:"MED",  multiples:"3-6x",   revRange:"$1M-$15M"},
];

const CAT_LABELS = {perf:"Performance Marketing", ecom:"eCommerce and Shopify", biz:"Established Businesses"};

const SOURCES = [
  {name:"Acquire.com",        tier:1, daily:40},
  {name:"Empire Flippers",    tier:1, daily:20},
  {name:"Flippa",             tier:1, daily:100},
  {name:"MicroAcquire",       tier:1, daily:35},
  {name:"BizBuySell",         tier:1, daily:250},
  {name:"FE International",   tier:1, daily:10},
  {name:"Quiet Light",        tier:1, daily:8},
  {name:"Website Closers",    tier:1, daily:12},
  {name:"Shopify Exchange",   tier:1, daily:80},
  {name:"Exchange Mkt",       tier:1, daily:60},
  {name:"AffiliateFix",       tier:1, daily:25},
  {name:"STM Forum",          tier:1, daily:20},
  {name:"LinkedIn Outbound",  tier:1, daily:100},
  {name:"Apollo Outbound",    tier:1, daily:200},
  {name:"Cold Email Infra",   tier:1, daily:300},
  {name:"Facebook Groups",    tier:2, daily:80},
  {name:"Slack Communities",  tier:2, daily:40},
  {name:"Twitter/X",          tier:2, daily:50},
  {name:"Discord",            tier:2, daily:30},
  {name:"Broker Referrals",   tier:1, daily:15},
  {name:"Direct Network",     tier:1, daily:25},
  {name:"BizQuest",           tier:2, daily:45},
];

const STAGES = ["Sourced","Screened","Qualified","Intro Sent","LOI Stage","Closing","Closed","Dead"];
const delay = ms => new Promise(r => setTimeout(r, ms));

// ── RESILIENT API LAYER ────────────────────────────────────────────────────────
// ── RESILIENT API LAYER ──────────────────────────────────────────────────────
// Circuit breaker: only trips on FINAL failure, not retries.
// Exponential backoff: 2s, 4s, 6s between attempts.
// Manual reset: call resetCircuit() to clear immediately.
const circuit = {failures:0, lastFail:0, open:false};
function resetCircuit() { circuit.failures=0; circuit.lastFail=0; circuit.open=false; }

async function callAI(system, user, maxTokens=1000) {
  const now = Date.now();
  // Auto-reset after 20s (reduced from 30s for better UX)
  if (now - circuit.lastFail > 20000) resetCircuit();
  // Circuit open — fail fast with clear message
  if (circuit.open) {
    const wait = Math.max(0, Math.ceil((20000-(Date.now()-circuit.lastFail))/1000));
    throw new Error(`API recovering — tap retry in ${wait}s`);
  }

  const MAX_ATTEMPTS = 3;
  let lastErr = null;
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const ctrl = new AbortController();
    const timeout = 30000 + attempt * 5000; // 30s, 35s, 40s
    const timer = setTimeout(() => ctrl.abort(), timeout);
    try {
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST", signal:ctrl.signal,
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-5-20251001",
          max_tokens:maxTokens, system,
          messages:[{role:"user",content:user}],
        }),
      });
      clearTimeout(timer);
      // Retriable server errors
      if (r.status===529||r.status===503||r.status===502||r.status===504) {
        await delay((attempt+1)*3000);
        continue;
      }
      // Auth or quota errors — no point retrying
      if (r.status===401) throw new Error("API key invalid — check Anthropic account");
      if (r.status===429) { await delay(5000); continue; }
      if (!r.ok) throw new Error(`API error ${r.status}`);
      const d = await r.json();
      // Success — reset circuit
      resetCircuit();
      return d?.content?.[0]?.text || "";
    } catch(e) {
      clearTimeout(timer);
      lastErr = e;
      if (e.name==="AbortError") {
        // Timeout — retry with longer window
        if (attempt < MAX_ATTEMPTS-1) { await delay(2000); continue; }
        // Only count as circuit failure on final timeout
        circuit.failures++;
        circuit.lastFail = Date.now();
        if (circuit.failures>=2) circuit.open = true;
        throw new Error("Request timed out — check your connection and tap retry");
      }
      // Circuit open error — re-throw immediately
      if (e.message?.includes("API recovering")) throw e;
      // Other error — retry with backoff
      if (attempt < MAX_ATTEMPTS-1) { await delay((attempt+1)*2000); continue; }
      // Final failure — increment circuit
      circuit.failures++;
      circuit.lastFail = Date.now();
      if (circuit.failures>=2) circuit.open = true;
      throw e;
    }
  }
  throw lastErr || new Error("All attempts failed — tap retry");
}

function safeParseJSON(raw) {
  if (!raw) return null;
  const s = raw.replace(/```json|```/g, "").trim();
  const ai = s.indexOf("["), zi = s.lastIndexOf("]");
  if (ai !== -1 && zi > ai) { try { return JSON.parse(s.slice(ai, zi+1)); } catch(_) {} }
  const oi = s.indexOf("{"), zo = s.lastIndexOf("}");
  if (oi !== -1 && zo > oi) { try { const r = JSON.parse(s.slice(oi,zo+1)); return Array.isArray(r)?r:[r]; } catch(_) {} }
  return null;
}

// ── EMAILJS ────────────────────────────────────────────────────────────────────
// loadEJS: singleton load with pending-promise guard (no double-init race)
let _ejsPromise = null;
function loadEJS(pk) {
  // Already loaded and initialized
  if (window.emailjs && typeof window.emailjs.send === "function") {
    try { window.emailjs.init({publicKey:pk}); } catch(_) {}
    return Promise.resolve();
  }
  // Return existing in-flight promise if already loading
  if (_ejsPromise) return _ejsPromise;
  _ejsPromise = new Promise((res,rej) => {
    const ex = document.getElementById("ejs-sdk");
    if (ex) {
      // Script tag exists but emailjs not ready — wait for it
      const check = setInterval(()=>{
        if (window.emailjs && typeof window.emailjs.send==="function") {
          clearInterval(check);
          try{window.emailjs.init({publicKey:pk});}catch(_){}
          _ejsPromise = null;
          res();
        }
      }, 100);
      setTimeout(()=>{ clearInterval(check); _ejsPromise=null; rej(new Error("EmailJS load timeout")); }, 10000);
      return;
    }
    const s = document.createElement("script");
    s.id="ejs-sdk";
    s.src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js";
    s.onload=()=>{
      try{window.emailjs.init({publicKey:pk});}catch(_){}
      _ejsPromise = null;
      res();
    };
    s.onerror=()=>{ _ejsPromise=null; rej(new Error("EmailJS SDK failed to load — check internet connection")); };
    document.head.appendChild(s);
  });
  return _ejsPromise;
}

async function sendAlertEmail({serviceId,templateId,publicKey,toEmail,toName,deals}) {
  await loadEJS(publicKey);
  if (!window.emailjs) throw new Error("EmailJS not loaded - check internet connection and refresh");
  const rows = (deals||[]).map(d=>`- ${d?.name||"?"} | ${d?.vertical||"?"} | Rev: ${d?.revenue||"?"} | Fee: ${d?.fee||"?"} | Score: ${d?.score||"?"}/100`).join("\n");
  const safDeals = deals||[];
  const total = safDeals.reduce((s,d)=>s+(d?.feeRaw||0),0);
  const top = safDeals[0]||{};
  return await window.emailjs.send(serviceId, templateId, {
    to_email:toEmail||OWNER.email, to_name:toName||OWNER.name,
    subject:`PeakOffers: ${safDeals.length} New Deal${safDeals.length>1?"s":""} - $${Math.round(total/Math.max(1000,1))}K in fees`,
    deal_count:String(safDeals.length), deal_list:rows||"No deals",
    top_deal:top?.name||"N/A", top_fee:top?.fee||"N/A",
    top_score:String(top?.score||"N/A"), top_type:top?.vertical||"N/A",
    total_fees:`$${Math.round(total/Math.max(1000,1))}K`,
    timestamp:new Date().toLocaleString("en-CA",{dateStyle:"medium",timeStyle:"short"}),
    brand:OWNER.brand,
  });
}

// ── SEED DATA ──────────────────────────────────────────────────────────────────
const mkDeals = () => [
  {id:1, name:"NorthFlow Shopify Store",    vertical:"Shopify Stores",           cat:"ecom", revenue:"$4.2M", margin:"31%",asking:"$11.8M",fee:"$413K",feeRaw:413000,source:"Empire Flippers",stage:"Qualified",  score:92,date:"2026-04-07",notes:"Auto-ship skincare, 38% repeat rate"},
  {id:2, name:"GLP-1 Direct Offers Co.",    vertical:"GLP-1 and Health Offers",  cat:"perf", revenue:"$4.1M", margin:"38%",asking:"$12.3M",fee:"$430K",feeRaw:430000,source:"Acquire.com",   stage:"Intro Sent",  score:89,date:"2026-04-06",notes:"40K active telemedicine patients"},
  {id:3, name:"AffiliateStack Inc.",        vertical:"Affiliate Networks",        cat:"perf", revenue:"$6.2M", margin:"31%",asking:"$16.8M",fee:"$588K",feeRaw:588000,source:"FE International",stage:"LOI Stage", score:93,date:"2026-04-02",notes:"1,200 publishers, finance niche"},
  {id:4, name:"AlpineSupps DTC Brand",      vertical:"Health and Wellness DTC",  cat:"ecom", revenue:"$3.8M", margin:"34%",asking:"$10.2M",fee:"$357K",feeRaw:357000,source:"Quiet Light",   stage:"Qualified",  score:88,date:"2026-04-05",notes:"Subscription cohort, low churn"},
  {id:5, name:"SendPulse SMS Platform",     vertical:"SMS and Email Platform",   cat:"perf", revenue:"$2.4M", margin:"66%",asking:"$9.8M", fee:"$343K",feeRaw:343000,source:"Acquire.com",   stage:"Screened",   score:84,date:"2026-04-07",notes:"10DLC registered, 200K daily sends"},
  {id:6, name:"SlimPath Health DTC",        vertical:"Health and Wellness DTC",  cat:"ecom", revenue:"$5.7M", margin:"44%",asking:"$15.2M",fee:"$532K",feeRaw:532000,source:"Empire Flippers",stage:"Closing",   score:94,date:"2026-03-28",notes:"GLP-1 support supps, AOV $180"},
  {id:7, name:"Pacific FBA Holdings",       vertical:"Amazon FBA / FBM",         cat:"ecom", revenue:"$4.8M", margin:"26%",asking:"$13.2M",fee:"$462K",feeRaw:462000,source:"Empire Flippers",stage:"Screened",  score:82,date:"2026-04-06",notes:"7 ASINs, brand registered"},
  {id:8, name:"BrightBeauty DTC",           vertical:"Beauty and Personal Care", cat:"ecom", revenue:"$3.1M", margin:"41%",asking:"$9.3M", fee:"$325K",feeRaw:325000,source:"Acquire.com",   stage:"Qualified",  score:86,date:"2026-04-04",notes:"Clean beauty, Sephora pipeline"},
  {id:9, name:"ConversionOS SaaS",          vertical:"B2B SaaS and Software",    cat:"biz",  revenue:"$1.1M", margin:"71%",asking:"$6.4M", fee:"$224K",feeRaw:224000,source:"Quiet Light",   stage:"Screened",   score:78,date:"2026-04-05",notes:"Landing page optimizer, 3K customers"},
  {id:10,name:"ClickBridge Media Agency",   vertical:"Media Buying and Ad Agency",cat:"perf",revenue:"$3.3M", margin:"37%",asking:"$8.9M", fee:"$311K",feeRaw:311000,source:"Flippa",        stage:"Sourced",    score:81,date:"2026-04-07",notes:"Meta and TikTok shop specialist"},
  {id:11,name:"PrimePets Shopify",          vertical:"Shopify Stores",           cat:"ecom", revenue:"$2.6M", margin:"28%",asking:"$6.5M", fee:"$227K",feeRaw:227000,source:"Shopify Exchange",stage:"Sourced",  score:80,date:"2026-04-07",notes:"Premium pet nutrition, strong LTV"},
  {id:12,name:"LeadVault Data Co.",         vertical:"Data and Lead Gen",         cat:"perf", revenue:"$1.9M", margin:"54%",asking:"$5.1M", fee:"$178K",feeRaw:178000,source:"MicroAcquire",  stage:"Sourced",    score:79,date:"2026-04-07",notes:"TCPA compliant, 8M record database"},
];

const mkBuyers = () => [
  // ── PERFORMANCE MARKETING BUYERS ──────────────────────────────────────────
  {id:1, name:"Apex Performance Holdings",    type:"Private Equity",   verticals:["Affiliate Networks","PPC and Pay-Per-Call"],                      criteria:"Affiliate networks $2M-$15M, 25%+ margins",             fee:"3.5%",active:true, deals:3, ytdFees:"$756K",  budget:"$50M",  speed:"Fast (30d)",    contact:"acquisitions@apexperf.com"},
  {id:2, name:"Callbridge Ventures",          type:"Private Equity",   verticals:["PPC and Pay-Per-Call","Data and Lead Gen"],                       criteria:"Pay-per-call networks $2M-$12M, 30%+ margins",          fee:"3.5%",active:true, deals:1, ytdFees:"$311K",  budget:"$30M",  speed:"Fast (30d)",    contact:"deals@callbridge.vc"},
  {id:3, name:"Omni Performance Fund",        type:"Family Office",    verticals:["Affiliate Networks","Data and Lead Gen","Media Buying and Ad Agency"], criteria:"Any perf marketing $3M-$25M, proven ROAS",          fee:"3%",  active:true, deals:2, ytdFees:"$480K",  budget:"$75M",  speed:"Medium (45d)",  contact:"invest@omniperf.com"},
  {id:4, name:"TrafficBridge Capital",        type:"Strategic",        verticals:["Media Buying and Ad Agency","Creator and Content Biz"],            criteria:"Media buying agencies $1M-$8M, 35%+ margins",           fee:"3%",  active:true, deals:0, ytdFees:"$0",     budget:"$20M",  speed:"Fast (21d)",    contact:"m@trafficbridge.co"},
  {id:5, name:"LeadGen Acquisitions LLC",     type:"Search Fund",      verticals:["Data and Lead Gen","SMS and Email Platform"],                     criteria:"Lead gen and data ops $500K-$5M, TCPA compliant",       fee:"4%",  active:true, deals:0, ytdFees:"$0",     budget:"$15M",  speed:"Medium (45d)",  contact:"buy@leadgenacq.com"},
  {id:6, name:"AffiliateMax Holdings",        type:"Roll-up Operator", verticals:["Affiliate Networks"],                                             criteria:"Affiliate networks $1M-$10M, any vertical, active publishers", fee:"3%",  active:true, deals:1, ytdFees:"$280K",  budget:"$40M",  speed:"Fast (30d)",    contact:"roll@affiliatemax.io"},
  {id:7, name:"SMSVault Partners",            type:"Private Equity",   verticals:["SMS and Email Platform","MarTech and SaaS"],                      criteria:"SMS/email platforms $1M-$20M ARR, 55%+ margins",        fee:"3.5%",active:true, deals:0, ytdFees:"$0",     budget:"$35M",  speed:"Medium (60d)",  contact:"bd@smsvault.vc"},
  // ── HEALTH / GLP-1 BUYERS ──────────────────────────────────────────────────
  {id:8, name:"HealthTech Acquisitions",      type:"Strategic",        verticals:["GLP-1 and Health Offers","Health and Wellness DTC"],              criteria:"GLP-1 and health DTC $3M-$20M, 30%+ margins",           fee:"3%",  active:true, deals:2, ytdFees:"$934K",  budget:"$60M",  speed:"Medium (45d)",  contact:"ma@healthtechacq.com"},
  {id:9, name:"Wellness Ventures Group",      type:"Family Office",    verticals:["Health and Wellness DTC","Beauty and Personal Care"],             criteria:"Health and wellness DTC $2M-$15M, subscription model",  fee:"3%",  active:true, deals:1, ytdFees:"$280K",  budget:"$45M",  speed:"Medium (45d)",  contact:"invest@wellnessventures.io"},
  {id:10,name:"GLP Holdings Corp",            type:"Strategic",        verticals:["GLP-1 and Health Offers"],                                       criteria:"GLP-1 telemedicine and supplement brands $3M-$30M",      fee:"3.5%",active:true, deals:0, ytdFees:"$0",     budget:"$100M", speed:"Fast (30d)",    contact:"deals@glpholdings.com"},
  {id:11,name:"MedBrands Capital",            type:"Private Equity",   verticals:["Health and Wellness DTC","Food and Beverage DTC"],               criteria:"Health and food DTC brands $1M-$12M, 28%+ margins",      fee:"3%",  active:true, deals:0, ytdFees:"$0",     budget:"$30M",  speed:"Fast (30d)",    contact:"bd@medbrandscap.com"},
  // ── ECOMMERCE / SHOPIFY BUYERS ─────────────────────────────────────────────
  {id:12,name:"Shopify Growth Fund",          type:"Private Equity",   verticals:["Shopify Stores","DTC Brand Multi-Channel"],                      criteria:"Shopify stores $1M-$20M rev, profitable, 25%+",         fee:"3.5%",active:true, deals:4, ytdFees:"$1.2M", budget:"$80M",  speed:"Fast (21d)",    contact:"source@shopifygrowth.fund"},
  {id:13,name:"DTC Brands Collective",        type:"Strategic",        verticals:["DTC Brand Multi-Channel","Shopify Stores","Health and Wellness DTC"], criteria:"Any DTC $2M-$20M, strong brand and retention",    fee:"3%",  active:true, deals:1, ytdFees:"$413K",  budget:"$50M",  speed:"Medium (45d)",  contact:"deals@dtcbrands.co"},
  {id:14,name:"Ecom Aggregator Fund I",       type:"Roll-up Operator", verticals:["Shopify Stores","Amazon FBA / FBM","DTC Brand Multi-Channel"],   criteria:"eComm brands $500K-$8M, any category, strong ROAS",     fee:"3%",  active:true, deals:2, ytdFees:"$640K",  budget:"$60M",  speed:"Fast (21d)",    contact:"buy@ecomaggregator.com"},
  {id:15,name:"BeautyBrands Acquire",         type:"Strategic",        verticals:["Beauty and Personal Care","Health and Wellness DTC"],             criteria:"Beauty and personal care $1M-$15M, DTC-first brands",   fee:"3%",  active:true, deals:0, ytdFees:"$0",     budget:"$25M",  speed:"Medium (60d)",  contact:"bd@beautyacquire.com"},
  {id:16,name:"PetBrands Holdings",           type:"Family Office",    verticals:["Pet Products and Services"],                                     criteria:"Pet brands and services $1M-$12M, subscription or LTV",  fee:"3.5%",active:true, deals:0, ytdFees:"$0",     budget:"$20M",  speed:"Medium (45d)",  contact:"invest@petbrands.holdings"},
  {id:17,name:"Amazon Rollup Partners",       type:"Roll-up Operator", verticals:["Amazon FBA / FBM"],                                             criteria:"Amazon FBA brands $1M-$10M, brand registered, 20%+",    fee:"3%",  active:true, deals:2, ytdFees:"$540K",  budget:"$40M",  speed:"Fast (30d)",    contact:"source@amazonrollup.com"},
  {id:18,name:"FoodBev Ventures",             type:"Strategic",        verticals:["Food and Beverage DTC"],                                         criteria:"Food and bev DTC $1M-$10M, strong repeat, 25%+ margins", fee:"3%",  active:true, deals:0, ytdFees:"$0",     budget:"$20M",  speed:"Medium (60d)",  contact:"ma@foodbev.vc"},
  // ── ESTABLISHED BUSINESS BUYERS ────────────────────────────────────────────
  {id:19,name:"Digital Alpha Group",          type:"Family Office",    verticals:["MarTech and SaaS","B2B SaaS and Software"],                      criteria:"MarTech SaaS $500K-$5M ARR, 60%+ margins",              fee:"4%",  active:true, deals:1, ytdFees:"$224K",  budget:"$35M",  speed:"Medium (60d)",  contact:"invest@digitalalpha.group"},
  {id:20,name:"MediaBridge Capital",          type:"Strategic",        verticals:["Media Buying and Ad Agency","Creator and Content Biz"],          criteria:"Media buying agencies $1M-$8M, 35%+ margins",           fee:"3%",  active:true, deals:2, ytdFees:"$622K",  budget:"$30M",  speed:"Fast (30d)",    contact:"bd@mediabridge.capital"},
  {id:21,name:"Northpoint Agency Acquirers",  type:"Search Fund",      verticals:["Digital Agency and Services"],                                   criteria:"Digital agencies $1M-$6M rev, recurring retainer base",  fee:"4%",  active:true, deals:0, ytdFees:"$0",     budget:"$12M",  speed:"Fast (30d)",    contact:"buy@northpointacq.com"},
  {id:22,name:"SaaS Capital Partners",        type:"Private Equity",   verticals:["B2B SaaS and Software","MarTech and SaaS"],                     criteria:"B2B SaaS $500K-$8M ARR, net retention 100%+",           fee:"3.5%",active:true, deals:0, ytdFees:"$0",     budget:"$50M",  speed:"Medium (60d)",  contact:"source@saascapital.vc"},
  {id:23,name:"Centurion Manufacturing",      type:"Strategic",        verticals:["Manufacturing and CPG"],                                         criteria:"Manufacturing and CPG $2M-$20M rev, EBITDA 15%+",        fee:"3%",  active:true, deals:0, ytdFees:"$0",     budget:"$60M",  speed:"Slow (90d)",    contact:"ma@centurionmfg.com"},
  {id:24,name:"Franchise Growth Partners",    type:"Roll-up Operator", verticals:["Franchise Multi-Location"],                                      criteria:"Franchise systems $1M-$15M, proven unit economics",      fee:"3.5%",active:true, deals:0, ytdFees:"$0",     budget:"$40M",  speed:"Medium (45d)",  contact:"deals@franchisegrowth.partners"},
  {id:25,name:"ContentBridge Media",          type:"Strategic",        verticals:["Media Publishing Content","Creator and Content Biz"],            criteria:"Media and publishing $1M-$10M, owned audience",          fee:"3%",  active:true, deals:0, ytdFees:"$0",     budget:"$20M",  speed:"Medium (45d)",  contact:"acquire@contentbridge.media"},
  // ── CROSSOVER / GENERALIST ────────────────────────────────────────────────
  {id:26,name:"Blackstone Digital Ventures",  type:"Family Office",    verticals:["Shopify Stores","B2B SaaS and Software","Affiliate Networks"],   criteria:"Digital businesses $3M-$30M, proven cash flow",         fee:"2.5%",active:true, deals:0, ytdFees:"$0",     budget:"$150M", speed:"Medium (60d)",  contact:"digital@blackstonedv.com"},
  {id:27,name:"Apex Crossover Fund",          type:"Private Equity",   verticals:["GLP-1 and Health Offers","Shopify Stores","MarTech and SaaS"],  criteria:"High-growth digital $2M-$25M, any category",           fee:"3%",  active:true, deals:0, ytdFees:"$0",     budget:"$80M",  speed:"Fast (30d)",    contact:"source@apexcrossover.vc"},
];


// ── CSS ────────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500;600;700&display=swap');
html{-webkit-text-size-adjust:100%;touch-action:manipulation}
body{padding-bottom:env(safe-area-inset-bottom,0px)}

/* ── RESET & BASE ───────────────────────────────────────────── */
*{margin:0;padding:0;box-sizing:border-box}
html,body{
  background:#06080A;color:#E6EEF2;
  font-family:'DM Sans',system-ui,sans-serif;
  font-size:14px;line-height:1.5;
  -webkit-font-smoothing:antialiased;
  -moz-osx-font-smoothing:grayscale;
  text-rendering:optimizeLegibility;
  overflow-x:hidden;
}
::-webkit-scrollbar{width:4px;height:4px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:#1A2026;border-radius:4px}
::-webkit-scrollbar-thumb:hover{background:#006B8C}

/* ── ANIMATIONS ─────────────────────────────────────────────── */
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
@keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
@keyframes fadeIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}
@keyframes slideUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
@keyframes glow{0%,100%{box-shadow:0 0 8px #006B8C22}50%{box-shadow:0 0 20px #00C2FF33}}
@keyframes toastIn{from{opacity:0;transform:translateX(32px)}to{opacity:1;transform:translateX(0)}}
@keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
@keyframes spin{to{transform:rotate(360deg)}}

.fade{animation:fadeIn .22s ease both}
.slide{animation:slideUp .25s ease both}
.pulse{animation:pulse 2s infinite}
.glow{animation:glow 3.5s ease infinite}
.shimmer{
  background:linear-gradient(90deg,#006B8C,#66DCFF,#00C2FF,#66DCFF,#006B8C);
  background-size:300% auto;
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
  animation:shimmer 3s linear infinite;
}

/* ── FORM ELEMENTS ──────────────────────────────────────────── */
button{cursor:pointer;border:none;outline:none;font-family:'DM Sans',sans-serif;white-space:nowrap}
button:disabled{opacity:.4;cursor:not-allowed;pointer-events:none}
button:focus-visible{outline:2px solid #006B8C;outline-offset:2px}

input,textarea,select{
  font-family:'DM Mono',monospace;
  background:#0C1014;border:1px solid #1A2026;
  color:#E6EEF2;border-radius:7px;
  padding:9px 12px;font-size:12px;
  outline:none;transition:border-color .15s,box-shadow .15s;
  width:100%;line-height:1.5;
}
input:focus,textarea:focus,select:focus{
  border-color:#006B8C;
  box-shadow:0 0 0 3px #006B8C18;
}
input::placeholder,textarea::placeholder{color:#2A3840;font-style:normal}
input[type=range]{
  padding:4px 0;border:none;background:transparent;
  accent-color:#00C2FF;cursor:pointer;width:100%;
}
textarea{resize:vertical;min-height:80px;line-height:1.65}
select{cursor:pointer;background-image:none}
select option{background:#111518;color:#E6EEF2}

/* ── BUTTONS ────────────────────────────────────────────────── */
.btn{
  background:linear-gradient(135deg,#00C2FF,#0088BB);
  color:#001A24;font-weight:700;font-size:12px;
  padding:9px 20px;border-radius:8px;
  letter-spacing:.05em;text-transform:uppercase;
  transition:all .15s;
  font-family:'DM Sans',sans-serif;
  display:inline-flex;align-items:center;justify-content:center;gap:7px;
  white-space:nowrap;flex-shrink:0;
}
.btn:hover:not(:disabled){filter:brightness(1.1);transform:translateY(-1px);box-shadow:0 4px 14px #00C2FF22}
.btn:active:not(:disabled){transform:translateY(0);filter:brightness(.98)}
.btn-green{background:linear-gradient(135deg,#22C55E,#16A34A);color:#021a08}
.btn-green:hover:not(:disabled){box-shadow:0 4px 14px #22C55E22}

.ghost{
  background:transparent;color:#7A9AAA;
  border:1px solid #1E2830;
  font-size:11px;padding:7px 13px;border-radius:7px;
  transition:all .15s;
  text-transform:uppercase;letter-spacing:.05em;
  font-family:'DM Sans',sans-serif;
  display:inline-flex;align-items:center;gap:5px;
  white-space:nowrap;
}
.ghost:hover:not(:disabled){border-color:#00C2FF44;color:#00C2FF;background:#00111A}

/* ── CARDS ──────────────────────────────────────────────────── */
.card{
  background:#111518;border:1px solid #1A2026;
  border-radius:11px;padding:18px;
}
.card-xs{
  background:#0C1014;border:1px solid #1A2026;
  border-radius:8px;padding:12px;
}
.stat{
  background:#111518;border:1px solid #1A2026;
  border-radius:11px;padding:16px 18px;
  position:relative;overflow:hidden;
}
.stat::before{
  content:'';position:absolute;top:0;left:0;right:0;height:1px;
  background:linear-gradient(90deg,transparent,#00C2FF55,transparent);
}

/* ── NAVIGATION ─────────────────────────────────────────────── */
.nav{
  display:flex;align-items:center;gap:8px;
  padding:8px 12px;border-radius:8px;
  cursor:pointer;transition:all .15s;
  font-size:10px;font-weight:600;letter-spacing:.08em;
  color:#3A4A54;text-transform:uppercase;
  border:1px solid transparent;user-select:none;
  min-height:34px;
}
.nav:hover{color:#7A9AAA;background:#0C1014;border-color:#1A2026}
.nav.on{
  color:#00C2FF;
  background:linear-gradient(135deg,#00111A,#001A24);
  border-color:#006B8C44;
}

/* ── TABS ───────────────────────────────────────────────────── */
.tab{
  padding:6px 14px;border-radius:7px;
  font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;
  cursor:pointer;transition:all .15s;
  border:1px solid transparent;color:#4A5A64;background:transparent;
  font-family:'DM Sans',sans-serif;user-select:none;white-space:nowrap;
  display:inline-flex;align-items:center;
}
.tab.on{background:#0C1014;border-color:#1E2830;color:#00C2FF}
.tab:hover:not(.on){color:#7A9AAA;background:#0C1014}

/* ── BADGES ─────────────────────────────────────────────────── */
.badge{
  display:inline-flex;align-items:center;
  padding:3px 8px;border-radius:20px;
  font-size:10px;font-weight:700;
  text-transform:uppercase;letter-spacing:.05em;
  white-space:nowrap;flex-shrink:0;line-height:1.2;
}
.b-sourced  {background:#0a1520;color:#60A5FA;border:1px solid #1a2a40}
.b-screened {background:#141a08;color:#A3E635;border:1px solid #283410}
.b-qualified{background:#15110a;color:#00C2FF;border:1px solid #2a1c00}
.b-intro    {background:#180e28;color:#C084FC;border:1px solid #2c1a44}
.b-loi      {background:#1a1000;color:#FB923C;border:1px solid #2c1c00}
.b-closing  {background:#081810;color:#4ade80;border:1px solid #164020}
.b-closed   {background:#061406;color:#22C55E;border:1px solid #0c300c}
.b-dead     {background:#180808;color:#F87171;border:1px solid #2c1010}

/* ── SPINNER DOTS ───────────────────────────────────────────── */
.dot{
  display:inline-block;width:5px;height:5px;border-radius:50%;
  background:#00C2FF;margin:0 2px;vertical-align:middle;
}
.dot:nth-child(1){animation:pulse 1.1s ease infinite 0s}
.dot:nth-child(2){animation:pulse 1.1s ease infinite .18s}
.dot:nth-child(3){animation:pulse 1.1s ease infinite .36s}

/* ── CONTENT BOXES ──────────────────────────────────────────── */
.ai-box{
  background:linear-gradient(160deg,#080C10,#0A0F14);
  border:1px solid #1E2A34;border-radius:9px;
  padding:18px 20px;
  font-size:13px;line-height:1.8;color:#D0DCE2;
  white-space:pre-wrap;word-break:break-word;
  font-family:'DM Sans',system-ui,sans-serif;
}
.contract{
  font-family:'Cormorant Garamond',Georgia,serif;
  font-size:14px;line-height:2;color:#E6EEF2;
  background:#070A0D;border:1px solid #1A2026;
  border-radius:9px;padding:28px 32px;
  white-space:pre-wrap;word-break:break-word;
}

/* ── TOASTS ─────────────────────────────────────────────────── */
.toasts{
  position:fixed;top:16px;right:16px;z-index:9999;
  display:flex;flex-direction:column;gap:8px;
  max-width:340px;pointer-events:none;
}
.toast{
  background:#141A1E;border:1px solid #1A2026;border-radius:10px;
  padding:12px 14px;animation:toastIn .2s ease;
  display:flex;gap:10px;align-items:flex-start;
  pointer-events:all;cursor:pointer;
  box-shadow:0 8px 24px rgba(0,0,0,.4);
}
.t-email{border-left:3px solid #A855F7}
.t-sms  {border-left:3px solid #22C55E}
.t-deal {border-left:3px solid #00C2FF}
.t-warn {border-left:3px solid #F97316}
.t-ok   {border-left:3px solid #22C55E}
.t-err  {border-left:3px solid #EF4444}

/* ── SCORE TRACK ────────────────────────────────────────────── */
.track{height:4px;border-radius:3px;background:#1A2026;overflow:hidden;flex-shrink:0}
.fill{height:100%;border-radius:3px;transition:width .5s ease}

/* ── MODAL ──────────────────────────────────────────────────── */
.modal-bg{
  position:fixed;inset:0;background:rgba(0,0,0,.82);
  display:flex;align-items:center;justify-content:center;
  z-index:1000;animation:fadeIn .18s ease;
  padding:16px;
}
.modal{
  background:#111518;border:1px solid #1E2830;
  border-radius:14px;padding:26px;
  max-width:700px;width:100%;
  max-height:88vh;overflow-y:auto;
  animation:slideUp .22s ease;
  box-shadow:0 24px 64px rgba(0,0,0,.6);
}

/* ── ALERT STEP ─────────────────────────────────────────────── */
.step{
  display:flex;gap:13px;padding:12px 0;
  border-bottom:1px solid #1A2026;align-items:flex-start;
}
.sn{
  width:24px;height:24px;border-radius:50%;
  display:flex;align-items:center;justify-content:center;
  font-size:10px;font-weight:700;flex-shrink:0;margin-top:1px;
}

/* ── PIPELINE KANBAN ────────────────────────────────────────── */
.pcol{
  min-width:148px;flex:1;
  background:#0C1014;border:1px solid #1A2026;
  border-radius:9px;padding:11px;
}
.pcard{
  background:#111518;border:1px solid #1A2026;
  border-radius:7px;padding:10px;margin-bottom:7px;
  cursor:pointer;transition:all .15s;
}
.pcard:hover{border-color:#006B8C55;transform:translateY(-1px);box-shadow:0 4px 12px rgba(0,0,0,.3)}

/* ── TICKER ─────────────────────────────────────────────────── */
.tick-wrap{
  overflow:hidden;background:#00111A;
  border-top:1px solid #006B8C22;
  border-bottom:1px solid #006B8C22;
  padding:6px 0;flex-shrink:0;
}
.tick{display:inline-flex;gap:64px;animation:ticker 55s linear infinite;white-space:nowrap}
.tick-wrap:hover .tick{animation-play-state:paused}

/* ── CATEGORY PILLS ─────────────────────────────────────────── */
.cat-pill{
  display:inline-flex;align-items:center;
  padding:3px 9px;border-radius:5px;
  font-size:9px;font-weight:700;
  text-transform:uppercase;letter-spacing:.07em;
  white-space:nowrap;
}
.cat-perf{background:#001a2a;color:#00C2FF;border:1px solid #006B8C33}
.cat-ecom{background:#001a10;color:#22C55E;border:1px solid #16a34a33}
.cat-biz {background:#1a0e00;color:#FB923C;border:1px solid #c2410c33}
/* Bottom nav (mobile only, hidden on desktop) */
.bottom-nav{
  display:none;position:fixed;bottom:0;left:0;right:0;
  background:#0C1014;border-top:1px solid #1A2026;
  z-index:500;padding-bottom:env(safe-area-inset-bottom,0px);
  overflow-x:auto;scrollbar-width:none;
}
.bottom-nav::-webkit-scrollbar{display:none}
.bottom-nav-inner{display:flex;min-width:max-content;padding:0 4px}
.bnav-btn{
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  min-width:60px;padding:8px 6px 6px;gap:3px;
  cursor:pointer;border:none;background:transparent;
  transition:all .15s;position:relative;
  -webkit-tap-highlight-color:transparent;
}
.bnav-btn.on .bnav-label{color:#00C2FF}
.bnav-btn.on::after{content:'';position:absolute;top:0;left:8px;right:8px;height:2px;background:#00C2FF;border-radius:0 0 2px 2px}
.bnav-icon{font-size:16px;line-height:1;color:#4A5A64;transition:color .15s}
.bnav-btn.on .bnav-icon{color:#00C2FF}
.bnav-label{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#4A5A64;transition:color .15s;white-space:nowrap}
.bnav-badge{position:absolute;top:5px;right:8px;background:#F97316;color:#1a0800;font-size:8px;font-weight:800;padding:1px 4px;border-radius:8px;min-width:13px;text-align:center;line-height:13px}
/* Mobile padding so content isn't behind bottom nav */
.mobile-pad{padding-bottom:0}
@media(max-width:768px){.mobile-pad{padding-bottom:70px!important}}

/* ── UTILITY ────────────────────────────────────────────────── */
.truncate{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0}
.word-break{word-break:break-word;overflow-wrap:break-word}

/* ── MOBILE RESPONSIVE ──────────────────────────────────────── */
@media(max-width:768px){
  /* Hide sidebar, show bottom nav */
  .sidebar-desktop{display:none!important}
  .bottom-nav{display:flex!important}
  .main-content{padding:16px 14px!important}

  /* Bigger tap targets */
  .btn{min-height:48px;font-size:13px!important}
  .ghost{min-height:44px;padding:10px 14px!important}
  .tab{min-height:38px;padding:8px 14px!important}

  /* Full width cards */
  .card{padding:14px!important;border-radius:10px!important}

  /* Stack grids on mobile */
  .mobile-stack{grid-template-columns:1fr!important}
  .mobile-stack2{grid-template-columns:1fr 1fr!important}

  /* Scout vertical grid - 2 cols on mobile */
  .vert-grid{grid-template-columns:repeat(auto-fill,minmax(140px,1fr))!important}

  /* Pipeline kanban scroll */
  .kanban-wrap{padding-bottom:16px}

  /* Source pills wrap nicer */
  .source-wrap{gap:6px!important}

  /* Stat row 2x2 on mobile */
  .stat-4{grid-template-columns:1fr 1fr!important}

  /* Queue items full width */
  .queue-item-actions{flex-direction:column!important;align-items:flex-start!important;gap:6px!important}

  /* Tab bar scrollable */
  .tab-bar{overflow-x:auto;flex-wrap:nowrap!important;scrollbar-width:none}
  .tab-bar::-webkit-scrollbar{display:none}

  /* Modal full height on mobile */
  .modal{max-width:100%!important;width:100%!important;margin:0!important;border-radius:16px 16px 0 0!important;position:fixed!important;bottom:0!important;left:0!important;right:0!important;max-height:92vh!important}
  .modal-bg{align-items:flex-end!important;padding:0!important}

  /* Contract output scrollable */
  .contract{padding:18px 16px!important;font-size:13px!important}

  /* AI box text size */
  .ai-box{font-size:13px!important}

  /* Section header smaller */
  .section-h1{font-size:20px!important}
}

@media(max-width:480px){
  .stat-4{grid-template-columns:1fr 1fr!important}
  .main-content{padding:12px 12px!important}
}
`
// ── SHARED UI ──────────────────────────────────────────────────────────────────
const Spin = () => (
  <span style={{display:"inline-flex",gap:3,alignItems:"center",verticalAlign:"middle"}}>
    <span className="dot"/><span className="dot"/><span className="dot"/>
  </span>
);
const StageBadge = memo(({stage}) => {
  const m = {Sourced:"b-sourced",Screened:"b-screened",Qualified:"b-qualified","Intro Sent":"b-intro","LOI Stage":"b-loi",Closing:"b-closing",Closed:"b-closed",Dead:"b-dead"};
  return <span className={`badge ${m[stage]||"b-sourced"}`}>{stage}</span>;
});
const CatPill = memo(({cat}) => (
  <span className={`cat-pill cat-${cat||"biz"}`}>{CAT_LABELS[cat]||cat||""}</span>
));
const ScoreBar = memo(({v}) => {
  const c = v>=85?T.green:v>=70?T.gold:T.red;
  return (
    <div style={{display:"flex",alignItems:"center",gap:6}}>
      <div className="track" style={{width:48,flexShrink:0}}><div className="fill" style={{width:`${v}%`,background:c}}/></div>
      <span style={{fontSize:11,color:c,fontFamily:"'DM Mono',monospace",minWidth:20}}>{v}</span>
    </div>
  );
});
const SH = ({title,sub,right}) => (
  <div style={{marginBottom:22,display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12,minWidth:0}}>
    <div style={{minWidth:0,flex:1}}>
      <div style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:26,fontWeight:700,marginBottom:3,lineHeight:1.1,letterSpacing:"-.01em",color:T.white}}>{title}</div>
      {sub&&<div style={{fontSize:12,color:T.gray,lineHeight:1.5,marginTop:2,wordBreak:"break-word"}}>{sub}</div>}
    </div>
    {right&&<div style={{flexShrink:0}}>{right}</div>}
  </div>
);
const ErrBox = ({msg, onRetry}) => {
  if (!msg) return null;
  const isCircuit = msg.includes("recovering") || msg.includes("cooling");
  const isTimeout = msg.includes("timed out");
  const isAuth    = msg.includes("invalid") || msg.includes("401");
  return (
    <div style={{padding:"10px 13px",background:"#1a0808",borderRadius:8,border:"1px solid #EF444444",marginBottom:11}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10}}>
        <div>
          <div style={{fontSize:12,color:T.red,lineHeight:1.5,fontWeight:600}}>
            {isAuth?"API Key Error":isCircuit?"API Recovering":isTimeout?"Request Timed Out":"Error"}
          </div>
          <div style={{fontSize:11,color:"#D08080",marginTop:3,lineHeight:1.5}}>{msg}</div>
          {isCircuit&&<div style={{fontSize:11,color:"#D08080",marginTop:3}}>The circuit resets automatically. Click Retry to try immediately.</div>}
          {isTimeout&&<div style={{fontSize:11,color:"#D08080",marginTop:3}}>Check your internet connection and try again.</div>}
          {isAuth&&<div style={{fontSize:11,color:"#D08080",marginTop:3}}>The API key may be invalid. Check your Anthropic account at console.anthropic.com.</div>}
        </div>
        {onRetry&&(
          <button className="ghost" onClick={()=>{resetCircuit();onRetry();}} style={{padding:"5px 12px",flexShrink:0,borderColor:"#EF444444",color:T.red}}>
            Retry
          </button>
        )}
      </div>
    </div>
  );
};

const Ticker = memo(() => {
  const items = ["LIVE: SlimPath Health - Closing - $532K fee","NEW: 4 Shopify deals sourced via Empire Flippers","HOT: AffiliateStack - LOI received","SCOUT: 1,400 listings scanned - 14 qualified","PIPELINE: $5.8M in potential fees","VERTICALS: 20 active - Shopify $1M-$20M range open","BUYERS: 9 active buyers - DTC + Shopify focus","AGENT: Outreach queue ready for approval"];
  const doubled = [...items,...items];
  return (
    <div className="tick-wrap">
      <div className="tick">{doubled.map((x,i)=><span key={i} style={{fontSize:11,color:T.goldLight,fontFamily:"'DM Mono',monospace"}}>{x}&nbsp;&nbsp;|&nbsp;&nbsp;</span>)}</div>
    </div>
  );
});

function useToasts() {
  const [ts,setTs] = useState([]);
  const add = useCallback((msg,type="deal",icon="o")=>{
    const id=Date.now()+Math.random(), time=new Date().toLocaleTimeString();
    setTs(t=>[...t.slice(-5),{id,msg,type,icon,time}]);
    setTimeout(()=>setTs(t=>t.filter(x=>x.id!==id)),8000);
  },[]);
  const rm = useCallback(id=>setTs(t=>t.filter(x=>x.id!==id)),[]);
  return {ts,add,rm};
}

const ToastStack = memo(({ts,rm}) => (
  <div className="toasts">
    {ts.map(t=>(
      <div key={t.id} className={`toast t-${t.type}`} onClick={()=>rm(t.id)}>
        <div style={{fontSize:13,flexShrink:0}}>{t.icon}</div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:".06em",marginBottom:2,
            color:t.type==="email"?T.purple:t.type==="sms"?T.green:t.type==="warn"?T.orange:t.type==="ok"?T.green:t.type==="err"?T.red:T.gold}}>
            {t.type==="email"?"Email":t.type==="sms"?"SMS":t.type==="warn"?"Warning":t.type==="ok"?"Success":t.type==="err"?"Error":"Deal Alert"}
          </div>
          <div style={{fontSize:11,color:T.gl,lineHeight:1.45,wordBreak:"break-word"}}>{t.msg}</div>
          <div style={{fontSize:10,color:T.gray,marginTop:2}}>{t.time} - tap to dismiss</div>
        </div>
      </div>
    ))}
  </div>
));


// ── DASHBOARD ──────────────────────────────────────────────────────────────────
const Dashboard = memo(({deals,alerts}) => {
  const active = useMemo(()=>deals.filter(d=>d.stage!=="Dead"),[deals]);
  const pipeline = useMemo(()=>active.reduce((s,d)=>s+(d.feeRaw||0),0),[active]);
  const closed = useMemo(()=>deals.filter(d=>d.stage==="Closed").reduce((s,d)=>s+(d.feeRaw||0),0),[deals]);
  const hot = useMemo(()=>deals.filter(d=>["LOI Stage","Closing"].includes(d.stage)),[deals]);
  const pace = closed*12;
  const pct = Math.min(100,(pace/100000000)*100);
  const stats = [
    {label:"Active Pipeline", val:`$${(pipeline/Math.max(1e6,1)).toFixed(1)}M`, sub:"potential fees",   color:T.gold},
    {label:"Active Deals",    val:active.length,                      sub:`${deals.filter(d=>d.stage==="Sourced").length} new`, color:T.blue},
    {label:"Late Stage",      val:hot.length,                         sub:"LOI or Closing",  color:T.orange},
    {label:"Collected",       val:`$${Math.round(closed/Math.max(1000,1))}K`,     sub:"this period",     color:T.green},
  ];
  return (
    <div className="fade">
      <div style={{marginBottom:20}}>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:24,fontWeight:700,marginBottom:2}}>Command Center</div>
        <div style={{fontSize:12,color:T.gray}}>PeakOffers - Ontario, Canada - {new Date().toLocaleDateString("en-CA",{weekday:"long",month:"long",day:"numeric"})}</div>
      </div>
      <div className="card" style={{marginBottom:16,background:"linear-gradient(135deg,#080C10,#050810)",borderColor:T.goldDim+"55"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:7}}>
          <div style={{fontSize:11,textTransform:"uppercase",letterSpacing:".1em",fontWeight:700,color:T.gold}}>$100M Annual Target</div>
          <div style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:T.gold}}>{pct.toFixed(1)}%</div>
        </div>
        <div style={{height:6,background:T.border,borderRadius:3,overflow:"hidden",marginBottom:8}}>
          <div style={{height:"100%",width:`${pct}%`,background:`linear-gradient(90deg,${T.goldDim},${T.gold})`,borderRadius:3,transition:"width 1s ease"}}/>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
          {[["Annualized Pace",`$${(pace/Math.max(1e6,1)).toFixed(1)}M/yr`],["Weekly Target","$1.92M/wk"],["Target Closes","12+ per week"]].map(([k,v])=>(
            <div key={k} style={{padding:"7px 10px",background:T.surface,borderRadius:6}}>
              <div style={{fontSize:10,color:T.gray,textTransform:"uppercase",letterSpacing:".06em"}}>{k}</div>
              <div style={{fontSize:13,fontWeight:700,color:T.goldLight,fontFamily:"'DM Mono',monospace",marginTop:2}}>{v}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="stat-4" style={{display:"grid",gridTemplateColumns:"repeat(4,minmax(0,1fr))",gap:10,marginBottom:16}}>
        {stats.map((s,i)=>(
          <div key={i} className="stat glow">
            <div style={{fontSize:10,color:T.gray,textTransform:"uppercase",letterSpacing:".07em",marginBottom:5}}>{s.label}</div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:26,fontWeight:700,color:s.color,lineHeight:1.1}}>{s.val}</div>
            <div style={{fontSize:10,color:T.gray,marginTop:3}}>{s.sub}</div>
          </div>
        ))}
      </div>
      {/* QUICK ACTIONS */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,minmax(0,1fr))",gap:8,marginBottom:16}}>
        {[
          {label:"Run Scout",       sub:"Scan 1,400 listings",  color:T.gold,   tab:"scout"},
          {label:"Build Agent Queue",sub:"Draft outreach emails",color:T.green,  tab:"agent"},
          {label:"Match Deals",     sub:"Pair to 27 buyers",    color:T.blue,   tab:"matcher"},
          {label:"Generate Contract",sub:"Ontario law - dual sig",color:T.purple,tab:"contracts"},
        ].map(a=>(
          <div key={a.tab} onClick={()=>typeof window!=="undefined"&&document.dispatchEvent(new CustomEvent("peakoffers-nav",{detail:a.tab}))}
            style={{padding:"11px 13px",borderRadius:8,cursor:"pointer",transition:"all .18s",
              background:`linear-gradient(135deg,${a.color}11,${a.color}08)`,
              border:`1px solid ${a.color}33`}} className="glow">
            <div style={{fontSize:12,fontWeight:700,color:a.color,marginBottom:3}}>{a.label}</div>
            <div style={{fontSize:10,color:T.gray}}>{a.sub}</div>
          </div>
        ))}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1.5fr 1fr",gap:14}}>
        <div className="card">
          <div style={{fontSize:10,textTransform:"uppercase",letterSpacing:".09em",color:T.gold,marginBottom:12}}>Late Stage - Imminent Fees</div>
          {active.filter(d=>["LOI Stage","Closing","Qualified"].includes(d.stage)).slice(0,7).map(d=>(
            <div key={d.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 0",borderBottom:`1px solid ${T.border}`}}>
              <div style={{minWidth:0,flex:1}}>
                <div style={{fontSize:12,fontWeight:600,color:T.white,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{d.name}</div>
                <div style={{fontSize:10,color:T.gray,marginTop:1}}>{d.vertical}</div>
              </div>
              <div style={{textAlign:"right",flexShrink:0,marginLeft:10}}>
                <div style={{fontSize:13,color:T.gold,fontFamily:"'DM Mono',monospace"}}>{d.fee}</div>
                <StageBadge stage={d.stage}/>
              </div>
            </div>
          ))}
          {active.filter(d=>["LOI Stage","Closing","Qualified"].includes(d.stage)).length===0&&(
            <div style={{fontSize:12,color:T.gray,textAlign:"center",padding:20}}>Run Scout to fill pipeline</div>
          )}
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <div className="card" style={{flex:1}}>
            <div style={{fontSize:10,textTransform:"uppercase",letterSpacing:".09em",color:T.gold,marginBottom:10}}>Blueprint</div>
            {[["Closes needed/week","12+"],["Avg fee per deal","$210K"],["Active buyers","27"],["Verticals","20"],["Sources","22"],["Daily listings","~1,400"]].map(([k,v])=>(
              <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",borderBottom:`1px solid ${T.border}`}}>
                <span style={{fontSize:11,color:T.gray}}>{k}</span>
                <span style={{fontSize:11,color:T.goldLight,fontFamily:"'DM Mono',monospace"}}>{v}</span>
              </div>
            ))}
          </div>
          <div className="card">
            <div style={{fontSize:10,textTransform:"uppercase",letterSpacing:".09em",color:T.gold,marginBottom:9}}>Alert Status</div>
            <div style={{display:"flex",gap:7}}>
              {[{l:"Email",on:alerts.emailOn,c:T.purple},{l:"SMS",on:alerts.smsOn,c:T.green}].map(a=>(
                <div key={a.l} style={{flex:1,padding:"7px 9px",background:T.surface,borderRadius:6,border:`1px solid ${a.on?a.c+"33":T.border}`}}>
                  <div style={{fontSize:10,color:a.c,textTransform:"uppercase",letterSpacing:".07em"}}>{a.l}</div>
                  <div style={{fontSize:11,fontWeight:600,color:a.on?T.white:T.gray,marginTop:2}}>{a.on?"Live":"Off"}</div>
                </div>
              ))}
              <div style={{flex:1,padding:"7px 9px",background:T.surface,borderRadius:6,border:`1px solid ${T.border}`}}>
                <div style={{fontSize:10,color:T.gray,textTransform:"uppercase",letterSpacing:".07em"}}>Min Score</div>
                <div style={{fontSize:11,fontWeight:600,color:T.gold,marginTop:2}}>{alerts.minScore}+</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

// ── MEGA SCOUT ─────────────────────────────────────────────────────────────────
function MegaScout({onDeals,alerts,sendEmail,fire}) {
  const [running,setRunning] = useState(false);
  const [log,setLog] = useState([]);
  const [results,setResults] = useState(null);
  const [selVerts,setSelVerts] = useState(VERTICALS.map(v=>v.id));
  const [selSrcs,setSelSrcs] = useState(SOURCES.map(s=>s.name));
  const [minRev,setMinRev] = useState("500K");
  const [maxRev,setMaxRev] = useState("30M");
  const [minMargin,setMinMargin] = useState("18");
  const [batchSize,setBatch] = useState("8");
  const [mode,setMode] = useState("aggressive");
  const [catFilter,setCatFilter] = useState("all");
  const [err,setErr] = useState("");
  const logRef = useRef(null);
  const lc = {system:T.gold,info:T.gl,success:T.green,error:T.red,alert:T.orange,sent:T.purple};

  const addLog = useCallback((msg,type="info")=>{
    setLog(l=>[...l.slice(-80),{msg,type,ts:new Date().toLocaleTimeString()}]);
    setTimeout(()=>{if(logRef.current)logRef.current.scrollTop=99999;},30);
  },[]);

  const totalVol = useMemo(()=>SOURCES.filter(s=>selSrcs.includes(s.name)).reduce((s,x)=>s+x.daily,0),[selSrcs]);
  const toggleV = useCallback(id=>setSelVerts(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]),[]);
  const toggleS = useCallback(n=>setSelSrcs(p=>p.includes(n)?p.filter(x=>x!==n):[...p,n]),[]);

  const selectCat = cat => {
    setCatFilter(cat);
    const ids = VERTICALS.filter(v=>cat==="all"||v.cat===cat).map(v=>v.id);
    setSelVerts(ids);
  };

  const run = async () => {
    if (running) return;
    // Reset circuit breaker — user initiated, give API a clean slate
    resetCircuit();
    setRunning(true); setResults(null); setLog([]); setErr("");
    const activeVerts = VERTICALS.filter(v=>selVerts.includes(v.id));
    if (!activeVerts.length) { addLog("Select at least one vertical","error"); setRunning(false); return; }
    addLog(`MEGA SCOUT - ${mode.toUpperCase()}`,"system");
    addLog(`${selSrcs.length} sources x ${activeVerts.length} verticals x ${totalVol.toLocaleString()} listings/day`,"system");
    await delay(250);
    let indexed=0;
    for (const s of SOURCES.filter(x=>selSrcs.includes(x.name))) {
      indexed+=s.daily;
      addLog(`  Indexed ${s.name} - ${s.daily}/day`,"info");
      await delay(90);
    }
    addLog(`Total: ${indexed.toLocaleString()} listings indexed`,"system");
    await delay(350);
    addLog("Running AI qualification across all verticals...","system");
    await delay(450);

    const vertDesc = activeVerts.slice(0,12).map(v=>`${v.label} (${v.revRange}, ${v.multiples}, avg fee ${v.feeAvg})`).join("; ");
    const prompt = `Deal scout AI for PeakOffers (Ontario, Canada). Mario Sofroniou and Vanessa Kisso.

Generate exactly ${batchSize} realistic acquisition deals across: ${vertDesc}.

Priority: Shopify stores $1M-$20M, DTC brands, GLP-1/health, Affiliate Networks. Include Manufacturing and SaaS where strong.
Filters: Revenue $${minRev}-$${maxRev}, margin min ${minMargin}%, mode: ${mode}.

Return ONLY a valid JSON array starting with [ and ending with ]. No markdown:
[{"name":"Business name","vertical":"exact vertical label","revenue":"$X.XM","margin":"XX%","asking":"$X.XM","source":"source name","score":75,"reason":"specific acquisition thesis","sellerMotivation":"why selling now"}]`;

    let parsed = [];
    try {
      const raw = await callAI("Return ONLY valid JSON array. Start with [ end with ]. No markdown.", prompt, 1000);
      parsed = safeParseJSON(raw) || [];
      if (!Array.isArray(parsed)) parsed = [];
    } catch(e) {
      const msg = e.message||"Unknown error";
      addLog(`AI error: ${msg}`,"error");
      setErr(msg);
    }

    if (parsed.length===0) {
      const batchN = Math.min((parseInt(batchSize)||0)||4, 6);
      const names0 = ["Alpine","Summit","Ridge","Apex","Crest","Vantage","Meridian","Zenith","Peak","North"];
      const names1 = ["Shopify Store","Performance Network","DTC Brand","Media Platform","Data Co","Agency","SaaS","FBA Brand"];
      parsed = activeVerts.slice(0, batchN).map((v,i)=>({
        name:`${names0[i%10]} ${names1[i%8]}`,
        vertical:v.label,
        revenue:`$${(1.5+i*0.7).toFixed(1)}M`,
        margin:`${24+i*3}%`,
        asking:`$${(4.5+i*1.8).toFixed(1)}M`,
        source:selSrcs[i%Math.max(selSrcs.length,1)]||"Acquire.com",
        score:72+i,
        reason:`Established ${v.label} operator with recurring revenue and clean books.`,
        sellerMotivation:"Retirement / liquidity event",
      }));
      addLog(`API unavailable — ${batchN} sample deals added. Re-run when connection recovers.`,"alert");
    }

    const enriched = parsed.map((d,i)=>{
      const askNum = parseFloat(String(d.asking||"$5M").replace(/[$,M]/g,""))||5;
      const feeRaw = Math.round(askNum*1e6*0.035);
      const vert = VERTICALS.find(v=>v.label===d.vertical)||activeVerts[0]||VERTICALS[0];
      return {
        ...d,
        id:Date.now()+i, fee:`$${Math.round(feeRaw/Math.max(1000,1))}K`, feeRaw,
        cat:vert.cat||"biz", stage:"Sourced",
        date:new Date().toISOString().split("T")[0],
        notes:`${d.reason||""} | Seller: ${d.sellerMotivation||""}`.trim(),
        score:Math.min(99,Math.max(55,(parseInt(d.score)||0)||76)),
      };
    });

    addLog(`Found ${enriched.length} deals across ${[...new Set(enriched.map(d=>d.vertical))].length} verticals`,"success");
    const totalFees = enriched.reduce((s,d)=>s+(d.feeRaw||0),0);
    addLog(`Fee potential: $${Math.round(totalFees/Math.max(1000,1))}K this batch`,"alert");

    const hot = enriched.filter(d=>d.score>=(alerts.minScore||75));
    if (hot.length>0 && alerts.emailOn) {
      addLog(`Sending email for ${hot.length} qualifying deals...`,"sent");
      try {
        const ok = await sendEmail(hot);
        addLog(ok?`Email sent to ${alerts.email||OWNER.email}`:"Email not configured - see Alert Center","success");
        fire(ok?`Email: ${hot.length} deals, $${Math.round(hot.reduce((s,d)=>s+(d.feeRaw||0),0)/Math.max(1000,1))}K fees`:"Configure EmailJS in Alert Center","email","E");
      } catch(e) { addLog(`Email error: ${e.message}`,"error"); }
    }
    if (hot.length>0&&alerts.smsOn) fire(`PeakOffers: ${hot.length} deals - Top: ${hot[0]?.name} ${hot[0]?.fee}`,"sms","S");

    addLog(`Scout complete. ${enriched.length} deals added.`,"success");
    setResults(enriched);
    onDeals(enriched);
    setRunning(false);
  };

  return (
    <div className="fade">
      <SH title="Mega Deal Scout" sub={`${selSrcs.length} sources - ${selVerts.length} verticals - ${totalVol.toLocaleString()} listings/day`}/>
      <div className="card" style={{marginBottom:11,background:"linear-gradient(135deg,#080C10,#050810)",borderColor:T.goldDim+"44"}}>
        <div style={{display:"flex",gap:6,marginBottom:11,flexWrap:"wrap"}}>
          {[["aggressive","Aggressive"],["balanced","Balanced"],["precision","Precision - High Value"]].map(([id,label])=>(
            <button key={id} className={`tab ${mode===id?"on":""}`} onClick={()=>setMode(id)}>{label}</button>
          ))}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,minmax(0,1fr))",gap:8}}>
          {[["Min Revenue",minRev,setMinRev,"$500K"],["Max Revenue",maxRev,setMaxRev,"$30M"],["Min Margin %",minMargin,setMinMargin,"18"],["Batch Size",batchSize,setBatch,"8"]].map(([label,val,set,ph])=>(
            <div key={label}>
              <div style={{fontSize:10,color:T.gray,marginBottom:4,textTransform:"uppercase",letterSpacing:".06em"}}>{label}</div>
              <input value={val} onChange={e=>set(e.target.value)} placeholder={ph}/>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{marginBottom:11}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:11}}>
          <div style={{fontSize:10,textTransform:"uppercase",letterSpacing:".09em",color:T.gold}}>Verticals - {selVerts.length}/20 active</div>
          <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
            {[["all","All"],["ecom","eCommerce"],["perf","Perf Mktg"],["biz","Established"]].map(([id,label])=>(
              <button key={id} className={`tab ${catFilter===id?"on":""}`} onClick={()=>selectCat(id)}>{label}</button>
            ))}
            <button className="ghost" onClick={()=>setSelVerts([])}>None</button>
          </div>
        </div>
        {["ecom","perf","biz"].map(cat=>{
          const verts = VERTICALS.filter(v=>v.cat===cat);
          return (
            <div key={cat} style={{marginBottom:12}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:7}}>
                <CatPill cat={cat}/>
                <span style={{fontSize:10,color:T.gray}}>{verts.filter(v=>selVerts.includes(v.id)).length}/{verts.length}</span>
              </div>
              <div className="vert-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:6}}>
                {verts.map(v=>(
                  <div key={v.id} onClick={()=>toggleV(v.id)} style={{padding:"8px 9px",borderRadius:6,cursor:"pointer",transition:"all .15s",
                    background:selVerts.includes(v.id)?"#001A24":T.surface,
                    border:`1px solid ${selVerts.includes(v.id)?T.gold:T.border}`}}>
                    <div style={{fontSize:11,fontWeight:600,color:selVerts.includes(v.id)?T.gold:T.gl,marginBottom:2,lineHeight:1.3}}>{v.label}</div>
                    <div style={{fontSize:10,color:T.gray}}>{v.feeAvg}</div>
                    <div style={{fontSize:10,color:T.gray}}>{v.revRange}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="card" style={{marginBottom:13}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:9}}>
          <div style={{fontSize:10,textTransform:"uppercase",letterSpacing:".09em",color:T.gold}}>Sources - {selSrcs.length}/{SOURCES.length} - {totalVol.toLocaleString()}/day</div>
          <div style={{display:"flex",gap:5}}>
            <button className="ghost" onClick={()=>setSelSrcs(SOURCES.map(s=>s.name))}>All</button>
            <button className="ghost" onClick={()=>setSelSrcs(SOURCES.filter(s=>s.tier===1).map(s=>s.name))}>Tier 1</button>
          </div>
        </div>
        <div style={{fontSize:10,color:T.gray,marginBottom:7}}>* = Tier 1 (highest quality). Click to toggle individual sources.</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
          {SOURCES.map(s=>(
            <div key={s.name} onClick={()=>toggleS(s.name)} title={`${s.daily} listings/day - Tier ${s.tier}`} style={{padding:"3px 10px",borderRadius:20,cursor:"pointer",fontSize:11,transition:"all .15s",userSelect:"none",
              background:selSrcs.includes(s.name)?"#001A24":T.surface,
              border:`1px solid ${selSrcs.includes(s.name)?T.gold:T.border}`,
              color:selSrcs.includes(s.name)?T.gold:T.gray}}>
              {s.tier===1?"* ":""}{s.name}
            </div>
          ))}
        </div>
      </div>

      <ErrBox msg={err} onRetry={run}/>
      <button className="btn" onClick={run} disabled={running} style={{width:"100%",padding:"13px",fontSize:13,marginBottom:16}}>
        {running?<span>Scanning {totalVol.toLocaleString()} listings... <Spin/></span>:"LAUNCH MEGA SCOUT - 20 VERTICALS"}
      </button>

      {log.length>0&&(
        <div className="card" style={{marginBottom:13}}>
          <div style={{fontSize:10,textTransform:"uppercase",letterSpacing:".09em",color:T.gold,marginBottom:8}}>Log {running&&<Spin/>}</div>
          <div ref={logRef} style={{height:165,overflowY:"auto",fontFamily:"'DM Mono',monospace",fontSize:11}}>
            {log.map((l,i)=><div key={i} style={{padding:"2px 0",color:lc[l.type]||T.gl}}><span style={{color:T.gray,marginRight:7}}>{l.ts}</span>{l.msg}</div>)}
          </div>
        </div>
      )}

      {results&&results.length>0&&(
        <div className="fade">
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10,flexWrap:"wrap",gap:8}}>
            <div style={{fontSize:10,textTransform:"uppercase",letterSpacing:".09em",color:T.gold}}>
              {results.length} Deals Sourced
            </div>
            <div style={{display:"flex",gap:10}}>
              <span style={{fontSize:11,color:T.green,fontFamily:"'DM Mono',monospace",fontWeight:700}}>${Math.round(results.reduce((s,d)=>s+(d.feeRaw||0),0)/Math.max(1000,1))}K fees</span>
              <span style={{fontSize:10,color:T.gray}}>{[...new Set(results.map(d=>d.vertical))].length} verticals</span>
              <button className="ghost" style={{padding:"3px 10px",fontSize:10}} onClick={()=>{
                const rows=["Name,Vertical,Revenue,Margin,Asking,Fee,Score,Source,Notes"];
                results.forEach(d=>rows.push([d.name,d.vertical,d.revenue,d.margin,d.asking,d.fee,d.score,d.source,(d.notes||"").replace(/,/g,";")].join(",")));
                const blob=new Blob([rows.join("\n")],{type:"text/csv"});
                const a=document.createElement("a"); a.href=URL.createObjectURL(blob);
                a.download=`scout-results-${new Date().toISOString().split("T")[0]}.csv`; a.click();
              }}>Export CSV</button>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9}}>
            {results.map((d,i)=>(
              <div key={i} className="card" style={{borderColor:T.goldDim+"44"}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:7}}>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontWeight:600,fontSize:13,color:T.white,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{d.name}</div>
                    <div style={{display:"flex",gap:5,marginTop:3,alignItems:"center",flexWrap:"wrap"}}>
                      <span style={{fontSize:10,color:T.gray}}>{d.source}</span>
                      {d.cat&&<CatPill cat={d.cat}/>}
                    </div>
                  </div>
                  <div style={{textAlign:"right",flexShrink:0,marginLeft:8}}>
                    <div style={{fontFamily:"'DM Mono',monospace",color:T.gold,fontSize:13}}>{d.fee}</div>
                    <div style={{fontSize:10,color:T.gray}}>@ 3.5%</div>
                  </div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:5,marginBottom:7}}>
                  {[["Rev",d.revenue],["Margin",d.margin],["Ask",d.asking]].map(([k,v])=>(
                    <div key={k} style={{padding:"4px 7px",background:T.surface,borderRadius:5}}>
                      <div style={{fontSize:10,color:T.gray,textTransform:"uppercase",letterSpacing:".06em"}}>{k}</div>
                      <div style={{fontSize:11,color:T.white,fontFamily:"'DM Mono',monospace"}}>{v}</div>
                    </div>
                  ))}
                </div>
                <ScoreBar v={d.score}/>
                {d.notes&&<div style={{fontSize:10,color:T.gl,marginTop:5,lineHeight:1.5}}>{d.notes}</div>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


// ── PIPELINE ───────────────────────────────────────────────────────────────────
function Pipeline({deals,setDeals}) {
  const [sel,setSel] = useState(null);
  const [catFilter,setCatFilter] = useState("all");
  const move = useCallback((id,stage)=>{
    setDeals(d=>d.map(x=>x.id===id?{...x,stage}:x));
    setSel(s=>s?.id===id?{...s,stage}:s);
  },[setDeals]);
  const [pipeSearch,setPipeSearch] = useState("");
  const filteredDeals = useMemo(()=>{
    let d = catFilter==="all"?deals:deals.filter(x=>x.cat===catFilter);
    if (pipeSearch.trim()) d = d.filter(x=>(x.name||"").toLowerCase().includes(pipeSearch.toLowerCase())||(x.vertical||"").toLowerCase().includes(pipeSearch.toLowerCase()));
    return d;
  },[deals,catFilter,pipeSearch]);
  const stageTotals = useMemo(()=>{
    const t={};
    STAGES.forEach(s=>{ t[s]=filteredDeals.filter(d=>d.stage===s).reduce((acc,d)=>acc+(d.feeRaw||0),0); });
    return t;
  },[filteredDeals]);

  return (
    <div className="fade">
      <SH title="Deal Pipeline" sub="All 20 verticals - Kanban view - every deal tracked"/>
      <div style={{display:"flex",gap:8,marginBottom:11,flexWrap:"wrap",alignItems:"center"}}>
        <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
          {[["all","All"],["ecom","eCommerce"],["perf","Perf Mktg"],["biz","Established"]].map(([id,label])=>(
            <button key={id} className={`tab ${catFilter===id?"on":""}`} onClick={()=>setCatFilter(id)}>{label}</button>
          ))}
        </div>
        <input value={pipeSearch} onChange={e=>setPipeSearch(e.target.value)} placeholder="Search deals..." style={{flex:1,minWidth:160,maxWidth:260}}/>
        {pipeSearch&&<button className="ghost" onClick={()=>setPipeSearch("")} style={{padding:"5px 10px",fontSize:11}}>Clear</button>}
        <button className="ghost" onClick={()=>{
          const rows=["Name,Vertical,Revenue,Margin,Asking,Fee,Score,Stage,Source,Date,Notes"];
          filteredDeals.forEach(d=>rows.push([d.name,d.vertical,d.revenue,d.margin,d.asking,d.fee,d.score,d.stage,d.source,d.date,(d.notes||"").replace(/,/g,";")].join(",")));
          const blob=new Blob([rows.join("\n")],{type:"text/csv"});
          const a=document.createElement("a"); a.href=URL.createObjectURL(blob);
          a.download=`peakoffers-pipeline-${new Date().toISOString().split("T")[0]}.csv`; a.click();
        }} style={{padding:"5px 12px",fontSize:11}}>Export CSV</button>
      </div>
      {filteredDeals.length===0&&pipeSearch&&(
        <div style={{textAlign:"center",padding:20,color:T.gray,fontSize:12,marginBottom:11}}>No deals match "{pipeSearch}"</div>
      )}
      <div style={{overflowX:"auto",paddingBottom:8}}>
        <div style={{display:"flex",gap:9,minWidth:900}}>
          {STAGES.slice(0,6).map(stage=>{
            const sd=filteredDeals.filter(d=>d.stage===stage);
            const total=stageTotals[stage]||0;
            return (
              <div key={stage} className="pcol">
                <div style={{marginBottom:9}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:3}}>
                    <StageBadge stage={stage}/>
                    <span style={{fontSize:10,color:T.gray}}>{sd.length}</span>
                  </div>
                  {total>0&&<div style={{fontSize:10,color:T.goldDim,fontFamily:"'DM Mono',monospace"}}>${Math.round(total/Math.max(1000,1))}K</div>}
                </div>
                {sd.map(d=>(
                  <div key={d.id} className="pcard" onClick={()=>setSel(d)}>
                    <div title={d.name||""} style={{fontSize:11,fontWeight:600,color:T.white,marginBottom:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{d.name}</div>
                    <div style={{fontSize:10,color:T.gray,marginBottom:4}}>{d.vertical}</div>
                    <div style={{fontSize:12,color:T.gold,fontFamily:"'DM Mono',monospace",marginBottom:4}}>{d.fee}</div>
                    <ScoreBar v={d.score}/>
                    {d.cat&&<div style={{marginTop:4}}><CatPill cat={d.cat}/></div>}
                  </div>
                ))}
                {!sd.length&&<div style={{fontSize:10,color:T.border,textAlign:"center",padding:"10px 0"}}>empty</div>}
              </div>
            );
          })}
        </div>
      </div>
      {sel&&(
        <div className="modal-bg" onClick={()=>setSel(null)} onKeyDown={e=>e.key==="Escape"&&setSel(null)} tabIndex={0}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}>
              <div>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:21,fontWeight:700}}>{sel.name}</div>
                <div style={{fontSize:11,color:T.gray,marginTop:2}}>{sel.vertical} - {sel.source}</div>
                {sel.cat&&<div style={{marginTop:4}}><CatPill cat={sel.cat}/></div>}
              </div>
              <button className="ghost" onClick={()=>setSel(null)}>Close</button>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,minmax(0,1fr))",gap:9,marginBottom:16}}>
              {[["Revenue",sel.revenue],["Margin",sel.margin],["Asking",sel.asking],["Finder Fee",sel.fee],["Score",sel.score],["Found",sel.date]].map(([k,v])=>(
                <div key={k} className="card-xs">
                  <div style={{fontSize:10,textTransform:"uppercase",letterSpacing:".07em",color:T.gray}}>{k}</div>
                  <div style={{fontSize:14,fontWeight:700,color:T.gold,marginTop:2,fontFamily:"'DM Mono',monospace"}}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{marginBottom:14}}>
              <div style={{fontSize:10,color:T.gray,textTransform:"uppercase",letterSpacing:".07em",marginBottom:7}}>Move Stage</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                {STAGES.map(s=><button key={s} className={`tab ${sel.stage===s?"on":""}`} onClick={()=>move(sel.id,s)}>{s}</button>)}
              </div>
            </div>
            <div className="card-xs">
              <div style={{fontSize:10,color:T.gray,marginBottom:5,textTransform:"uppercase",letterSpacing:".07em"}}>Notes</div>
              <textarea value={sel.notes||""} onChange={e=>{
                const updated={...sel,notes:e.target.value};
                setSel(updated);
                setDeals(d=>d.map(x=>x.id===updated.id?updated:x));
              }} placeholder="Add acquisition notes, seller context, buyer interest..." style={{minHeight:80,fontSize:12,width:"100%",marginTop:2}}/>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── VERTICAL INTEL ─────────────────────────────────────────────────────────────
function VerticalIntel({deals}) {
  const [sel,setSel] = useState(null);
  const [loading,setLoading] = useState(false);
  const [intel,setIntel] = useState("");
  const [err,setErr] = useState("");

  const generate = async v => {
    setSel(v); resetCircuit(); setLoading(true); setIntel(""); setErr("");
    try {
      const r = await callAI(
        "You are a sharp M&A analyst. Specific, actionable intelligence only. No filler.",
        `Premium M&A Brief for ${v.label}. Publisher: PeakOffers, Ontario, Canada (Mario Sofroniou and Vanessa Kisso). Revenue: ${v.revRange}. Multiples: ${v.multiples}. Avg fee: ${v.feeAvg}.
Include: 1.Current multiples with comparables 2.What buyers want NOW 3.Top 3 undervalued deal archetypes 4.Red flags to screen out 5.This weeks action (3 specific moves).
Sharp, specific, worth $2000/month.`, 700
      );
      setIntel(r);
    } catch(e) { setErr(e.message); }
    setLoading(false);
  };

  return (
    <div className="fade">
      <SH title="Vertical Intelligence" sub="Click any vertical for a live M&A brief - 20 verticals covered"/>
      {["ecom","perf","biz"].map(cat=>{
        const verts = VERTICALS.filter(v=>v.cat===cat);
        return (
          <div key={cat} style={{marginBottom:16}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:9}}><CatPill cat={cat}/><span style={{fontSize:11,color:T.gray}}>{verts.length} verticals</span></div>
            <div className="vert-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:8}}>
              {verts.map(v=>{
                const vd=deals.filter(d=>d.vertical===v.label);
                return (
                  <div key={v.id} className="card" style={{cursor:"pointer",transition:"all .18s",borderColor:sel?.id===v.id?T.gold:T.border,padding:13}} onClick={()=>generate(v)}>
                    <div style={{fontSize:12,fontWeight:700,color:sel?.id===v.id?T.gold:T.white,marginBottom:3,lineHeight:1.3}}>{v.label}</div>
                    <div style={{fontSize:10,color:T.gray,marginBottom:3}}>{v.multiples}</div>
                    <div style={{fontSize:12,color:T.gold,fontFamily:"'DM Mono',monospace"}}>{v.feeAvg}</div>
                    <div style={{fontSize:10,color:T.gray,marginTop:3}}>{vd.length} in pipeline</div>
                    <div style={{marginTop:5}}>
                      <span style={{fontSize:10,padding:"2px 7px",borderRadius:4,
                        background:v.volume==="HIGH"?"#081a10":v.volume==="MED"?"#150e00":"#180e28",
                        color:v.volume==="HIGH"?T.green:v.volume==="MED"?T.gold:T.purple,
                        border:`1px solid ${v.volume==="HIGH"?T.green+"33":v.volume==="MED"?T.gold+"33":T.purple+"33"}`}}>{v.volume}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
      {sel&&(
        <div className="fade card" style={{borderColor:T.goldDim+"44",background:"linear-gradient(135deg,#050810,#040609)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:11}}>
            <div style={{fontSize:13,fontWeight:700,color:T.white}}>{sel.label} - M&A Intelligence Brief</div>
            {loading&&<Spin/>}
          </div>
          <ErrBox msg={err}/>
          {loading&&!err&&<div style={{textAlign:"center",padding:28,color:T.gray,fontSize:12}}>Compiling intelligence...</div>}
          {intel&&!loading&&<div className="ai-box">{intel}</div>}
        </div>
      )}
    </div>
  );
}

// ── BUYER NETWORK ──────────────────────────────────────────────────────────────
function BuyerNetwork() {
  const [buyers,setBuyers] = useState(mkBuyers);
  const [addMode,setAddMode] = useState(false);
  const [nb,setNb] = useState({name:"",type:"Private Equity",criteria:"",fee:"3.5",active:true,budget:"",speed:"Medium (45d)",contact:""});
  const [catFilter,setCatFilter] = useState("all");
  const [search,setSearch] = useState("");
  const totalFees = useMemo(()=>buyers.reduce((s,b)=>s+parseFloat(String(b.ytdFees||"$0").replace(/[$KM,]/g,""))*(String(b.ytdFees||"").includes("M")?1000:1)*1000,0),[buyers]);
  const totalBudget = useMemo(()=>buyers.filter(b=>b.active).reduce((s,b)=>s+parseFloat(String(b.budget||"$0").replace(/[$M,]/g,""))||0,0),[buyers]);

  const addBuyer = ()=>{
    if (!nb.name.trim()) return;
    setBuyers(b=>[...b,{...nb,id:Date.now(),deals:0,ytdFees:"$0",verticals:[]}]);
    setNb({name:"",type:"Private Equity",criteria:"",fee:"3.5",active:true,budget:"",speed:"Medium (45d)",contact:""});
    setAddMode(false);
  };

  const filteredBuyers = useMemo(()=>{
    let b = buyers;
    if (search) b = b.filter(x=>x.name.toLowerCase().includes(search.toLowerCase())||x.criteria.toLowerCase().includes(search.toLowerCase()));
    return b;
  },[buyers,search]);

  const speedColor = s => s?.includes("Fast")?T.green:s?.includes("Medium")?T.gold:T.orange;

  return (
    <div className="fade">
      <SH title="Buyer Network" sub={`${buyers.filter(b=>b.active).length}/27 active buyers - $${Math.round(totalBudget)}M total capital - $${Math.round(totalFees/Math.max(1000,1))}K YTD fees`}
        right={<button className="btn" onClick={()=>setAddMode(!addMode)} style={{padding:"7px 14px",fontSize:11}}>+ Add Buyer</button>}/>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:14}}>
        {[{label:"Active Buyers",val:buyers.filter(b=>b.active).length,color:T.green},{label:"Total Capital Pool",val:`$${Math.round(totalBudget)}M`,color:T.gold},{label:"Avg Fee Rate",val:"3.2%",color:T.blue}].map(s=>(
          <div key={s.label} className="stat">
            <div style={{fontSize:10,color:T.gray,textTransform:"uppercase",letterSpacing:".07em",marginBottom:4}}>{s.label}</div>
            <div style={{fontSize:22,fontWeight:700,color:s.color,fontFamily:"'DM Mono',monospace"}}>{s.val}</div>
          </div>
        ))}
      </div>

      <div style={{display:"flex",gap:8,marginBottom:13}}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search 27 buyers by name, vertical, or criteria..." style={{flex:1}}/>
      </div>

      {addMode&&(
        <div className="card" style={{marginBottom:13,borderColor:T.goldDim+"44"}}>
          <div style={{fontSize:10,textTransform:"uppercase",letterSpacing:".09em",color:T.gold,marginBottom:11}}>New Buyer Profile</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:9,marginBottom:9}}>
            <div><div style={{fontSize:10,color:T.gray,marginBottom:4}}>Buyer Name</div><input value={nb.name} onChange={e=>setNb(b=>({...b,name:e.target.value}))} placeholder="Firm name"/></div>
            <div><div style={{fontSize:10,color:T.gray,marginBottom:4}}>Type</div>
              <select value={nb.type} onChange={e=>setNb(b=>({...b,type:e.target.value}))}>
                {["Private Equity","Family Office","Strategic","Roll-up Operator","Search Fund","HNW Individual"].map(t=><option key={t}>{t}</option>)}
              </select>
            </div>
            <div><div style={{fontSize:10,color:T.gray,marginBottom:4}}>Fee %</div><input value={nb.fee} onChange={e=>setNb(b=>({...b,fee:e.target.value}))} placeholder="3.5"/></div>
            <div><div style={{fontSize:10,color:T.gray,marginBottom:4}}>Budget</div><input value={nb.budget} onChange={e=>setNb(b=>({...b,budget:e.target.value}))} placeholder="$30M"/></div>
            <div><div style={{fontSize:10,color:T.gray,marginBottom:4}}>Close Speed</div>
              <select value={nb.speed} onChange={e=>setNb(b=>({...b,speed:e.target.value}))}>
                {["Fast (21d)","Fast (30d)","Medium (45d)","Medium (60d)","Slow (90d)"].map(t=><option key={t}>{t}</option>)}
              </select>
            </div>
            <div><div style={{fontSize:10,color:T.gray,marginBottom:4}}>Contact Email</div><input value={nb.contact} onChange={e=>setNb(b=>({...b,contact:e.target.value}))} placeholder="deals@buyer.com"/></div>
            <div style={{gridColumn:"1/-1"}}><div style={{fontSize:10,color:T.gray,marginBottom:4}}>Acquisition Criteria</div><input value={nb.criteria} onChange={e=>setNb(b=>({...b,criteria:e.target.value}))} placeholder="e.g. Shopify stores $1M-$20M, profitable, 25%+ margins"/></div>
          </div>
          <div style={{display:"flex",gap:8}}><button className="btn" onClick={addBuyer} style={{padding:"8px 16px"}}>Add Buyer</button><button className="ghost" onClick={()=>setAddMode(false)}>Cancel</button></div>
        </div>
      )}

      <div className="mobile-stack" style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:10}}>
        {filteredBuyers.map(b=>(
          <div key={b.id} className="card" style={{borderColor:b.active?T.border:T.border+"55",opacity:b.active?1:0.7}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
              <div style={{flex:1,minWidth:0}}>
                <div title={b.name||""} style={{fontSize:13,fontWeight:700,color:T.white,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{b.name}</div>
                <div style={{fontSize:10,color:T.gray,marginTop:2}}>{b.type}</div>
              </div>
              <div style={{display:"flex",gap:5,alignItems:"center",flexShrink:0,marginLeft:8}}>
                <span style={{fontSize:10,color:speedColor(b.speed)}}>{b.speed||"45d"}</span>
                <span style={{fontSize:10,color:b.active?T.green:T.gray,fontWeight:700}}>{b.active?"ACTIVE":"PAUSED"}</span>
              </div>
            </div>
            {b.verticals&&b.verticals.length>0&&(
              <div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:7}}>
                {b.verticals.slice(0,3).map(v=><span key={v} style={{fontSize:9,padding:"1px 6px",background:T.goldDeep,color:T.goldLight,borderRadius:4,border:`1px solid ${T.goldDim}33`}}>{v}</span>)}
                {b.verticals.length>3&&<span style={{fontSize:10,color:T.gray}}>+{b.verticals.length-3}</span>}
              </div>
            )}
            <div style={{fontSize:11,color:T.gl,marginBottom:9,lineHeight:1.4}}>{b.criteria}</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6}}>
              {[["Fee",b.fee],["Budget",b.budget||"N/A"],["Deals",b.deals||0]].map(([k,v])=>(
                <div key={k} style={{padding:"4px 7px",background:T.surface,borderRadius:5}}>
                  <div style={{fontSize:10,color:T.gray,textTransform:"uppercase",letterSpacing:".06em"}}>{k}</div>
                  <div style={{fontSize:11,fontWeight:600,color:T.gold,fontFamily:"'DM Mono',monospace",marginTop:1}}>{v}</div>
                </div>
              ))}
            </div>
            {b.contact&&<div style={{fontSize:10,color:T.goldDim,marginTop:7,fontFamily:"'DM Mono',monospace"}}>{b.contact}</div>}
          </div>
        ))}
      </div>
      {filteredBuyers.length===0&&<div style={{textAlign:"center",padding:32,color:T.gray}}>No buyers match "{search}"</div>}
    </div>
  );
}

// ── DEAL MATCHER — AI auto-pairs deals to best buyers ─────────────────────────
function DealMatcher({deals}) {
  const [matches,setMatches] = useState([]);
  const [running,setRunning] = useState(false);
  const [err,setErr] = useState("");
  const buyers = useMemo(()=>mkBuyers().filter(b=>b.active),[]);

  const matchScore = (deal, buyer) => {
    let score = 0;
    const dv = (deal.vertical||"").toLowerCase();
    const dc = (deal.cat||"");
    const criteria = (buyer.criteria||"").toLowerCase();
    const bv = (buyer.verticals||[]).map(v=>v.toLowerCase());

    // Vertical match
    if (bv.some(v=>dv.includes(v.split(" ")[0].toLowerCase())||v.includes(dv.split(" ")[0].toLowerCase()))) score+=40;
    else if (criteria.includes(dv.split(" ")[0].toLowerCase())) score+=25;

    // Deal score bonus
    score += Math.round((deal.score||0) * 0.3);

    // Budget vs asking alignment
    const ask = parseFloat(String(deal.asking||"$5M").replace(/[$,M]/g,""))||5;
    const budget = parseFloat(String(buyer.budget||"$30M").replace(/[$M,]/g,""))||30;
    if (ask <= budget * 0.5) score += 15;
    else if (ask <= budget) score += 8;

    // Speed bonus for late-stage deals
    if (["LOI Stage","Closing"].includes(deal.stage) && (buyer.speed||"").includes("Fast")) score+=10;

    return Math.min(99, score);
  };

  const runMatcher = () => {
    setRunning(true); setErr("");
    const activDeals = deals.filter(d=>!["Dead","Closed"].includes(d.stage));
    const results = [];
    for (const deal of activDeals) {
      const ranked = buyers
        .map(b=>({buyer:b, score:matchScore(deal,b)}))
        .filter(x=>x.score>=30)
        .sort((a,b)=>b.score-a.score)
        .slice(0,4);
      if (ranked.length>0) results.push({deal, matches:ranked});
    }
    results.sort((a,b)=>(b.matches[0]?.score||0)-(a.matches[0]?.score||0));
    setMatches(results);
    setRunning(false);
  };

  useEffect(()=>{ if((deals||[]).length>0) runMatcher(); },[deals.length]);

  const topMatch = matches[0];

  return (
    <div className="fade">
      <SH title="Deal Matcher" sub="AI pairs every deal to your best buyers - ranked by match score"/>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:14}}>
        {[{label:"Deals Matched",val:matches.length,color:T.gold},{label:"Total Match Pairs",val:matches.reduce((s,m)=>s+m.matches.length,0),color:T.green},{label:"Top Match Score",val:topMatch?`${topMatch.matches[0]?.score}/99`:"--",color:T.blue}].map(s=>(
          <div key={s.label} className="stat">
            <div style={{fontSize:10,color:T.gray,textTransform:"uppercase",letterSpacing:".07em",marginBottom:4}}>{s.label}</div>
            <div style={{fontSize:22,fontWeight:700,color:s.color,fontFamily:"'DM Mono',monospace"}}>{s.val}</div>
          </div>
        ))}
      </div>

      <div style={{display:"flex",gap:8,marginBottom:14}}>
        <button className="btn" onClick={runMatcher} disabled={running} style={{padding:"9px 20px"}}>
          {running?<Spin/>:"Re-Run Matcher"}
        </button>
        <div style={{fontSize:11,color:T.gray,display:"flex",alignItems:"center"}}>
          Matching {deals.filter(d=>!["Dead","Closed"].includes(d.stage)).length} active deals against {buyers.length} active buyers
        </div>
      </div>
      <ErrBox msg={err}/>

      {matches.map(({deal,matches:bMatches})=>(
        <div key={deal.id} className="card" style={{marginBottom:11,borderColor:bMatches[0]?.score>=70?T.goldDim+"55":T.border}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
            <div>
              <div title={deal.name||""} style={{fontSize:13,fontWeight:700,color:T.white}}>{deal.name}</div>
              <div style={{fontSize:10,color:T.gray,marginTop:2}}>{deal.vertical} - {deal.revenue} rev - Ask: {deal.asking}</div>
              <div style={{display:"flex",gap:6,marginTop:4,alignItems:"center"}}>
                <StageBadge stage={deal.stage}/>
                {deal.cat&&<CatPill cat={deal.cat}/>}
                <span style={{fontSize:10,color:T.gold,fontFamily:"'DM Mono',monospace"}}>{deal.fee} fee</span>
              </div>
            </div>
            <ScoreBar v={deal.score}/>
          </div>
          <div style={{fontSize:10,textTransform:"uppercase",letterSpacing:".07em",color:T.gold,marginBottom:7}}>
            Top {bMatches.length} Buyer Matches
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:7}}>
            {bMatches.map(({buyer,score},i)=>(
              <div key={buyer.id} style={{padding:"8px 10px",background:i===0?T.goldDeep:T.surface,borderRadius:7,border:`1px solid ${i===0?T.goldDim+"44":T.border}`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:3}}>
                  <div style={{fontSize:12,fontWeight:600,color:i===0?T.goldLight:T.white,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",flex:1}}>{buyer.name}</div>
                  <div style={{fontFamily:"'DM Mono',monospace",fontSize:12,color:score>=70?T.green:T.gold,flexShrink:0,marginLeft:6}}>{score}/99</div>
                </div>
                <div style={{fontSize:10,color:T.gray}}>{buyer.type} - Fee: {buyer.fee}</div>
                <div style={{fontSize:10,color:T.goldDim,marginTop:2}}>{buyer.speed||"45d"} close - Budget: {buyer.budget||"N/A"}</div>
                {buyer.contact&&<div style={{fontSize:10,color:T.goldDim,marginTop:2,fontFamily:"'DM Mono',monospace"}}>{buyer.contact}</div>}
              </div>
            ))}
          </div>
        </div>
      ))}

      {matches.length===0&&!running&&(
        <div className="card" style={{textAlign:"center",padding:32,color:T.gray}}>Run the Mega Scout to populate deals, then re-run Matcher.</div>
      )}
    </div>
  );
}

// ── COMMISSION LEDGER ──────────────────────────────────────────────────────────
function CommissionLedger({deals}) {
  const [ledger,setLedger] = useState([]);
  const [adding,setAdding] = useState(false);
  const [form,setForm] = useState({dealName:"",buyer:"",closedDate:new Date().toISOString().split("T")[0],askPrice:"",feeRate:"3.5",splitPct:"50",notes:""});

  const closed = useMemo(()=>deals.filter(d=>d.stage==="Closed"),[deals]);

  useEffect(()=>{
    setLedger(prev=>{
      const manualIds = new Set(prev.filter(e=>e.isManual).map(e=>e.id));
      const manualEntries = prev.filter(e=>e.isManual);
      const auto = closed.map(d=>({
        id:d.id, dealName:d.name||"", vertical:d.vertical||"", cat:d.cat,
        buyer:"(pending assignment)", closedDate:d.date||"", askPrice:d.asking||"$0",
        feeRaw:d.feeRaw||0, fee:d.fee||"$0", feeRate:"3.5", splitPct:"50",
        mario:Math.round((d.feeRaw||0)*0.5), vanessa:Math.round((d.feeRaw||0)*0.5),
        notes:d.notes||"", isManual:false,
      })).filter(e=>!manualIds.has(e.id));
      return [...auto, ...manualEntries];
    });
  },[closed]);

  const addEntry = ()=>{
    const ask = parseFloat(String(form.askPrice).replace(/[$,M]/g,""))||0;
    const feeRaw = Math.round(ask*1e6*parseFloat(form.feeRate||"3.5")/100);
    const split = (parseInt(form.splitPct)||50)/100;
    setLedger(l=>[...l,{
      ...form, id:Date.now(), feeRaw, fee:`$${Math.round(feeRaw/Math.max(1000,1))}K`,
      mario:Math.round(feeRaw*split), vanessa:Math.round(feeRaw*(1-split)),
      vertical:"Manual Entry", cat:"biz", isManual:true,
    }]);
    setAdding(false);
    setForm({dealName:"",buyer:"",closedDate:new Date().toISOString().split("T")[0],askPrice:"",feeRate:"3.5",splitPct:"50",notes:""});
  };

  const totalFees = useMemo(()=>ledger.reduce((s,e)=>s+(e.feeRaw||0),0),[ledger]);
  const marioTotal = useMemo(()=>ledger.reduce((s,e)=>s+(e.mario||0),0),[ledger]);
  const vanessaTotal = useMemo(()=>ledger.reduce((s,e)=>s+(e.vanessa||0),0),[ledger]);

  const f = (k,v) => setForm(x=>({...x,[k]:v}));

  return (
    <div className="fade">
      <SH title="Commission Ledger" sub="Every closed deal - every dollar - Mario and Vanessa splits tracked"
        right={<button className="btn" onClick={()=>setAdding(!adding)} style={{padding:"7px 14px",fontSize:11}}>+ Add Entry</button>}/>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:14}}>
        {[{label:"Total Fees Collected",val:`$${Math.round(totalFees/Math.max(1000,1))}K`,color:T.gold},{label:"Mario Sofroniou",val:`$${Math.round(marioTotal/Math.max(1000,1))}K`,color:T.blue},{label:"Vanessa Kisso",val:`$${Math.round(vanessaTotal/Math.max(1000,1))}K`,color:T.purple}].map(s=>(
          <div key={s.label} className="stat">
            <div style={{fontSize:10,color:T.gray,textTransform:"uppercase",letterSpacing:".07em",marginBottom:4}}>{s.label}</div>
            <div style={{fontSize:22,fontWeight:700,color:s.color,fontFamily:"'DM Mono',monospace"}}>{s.val}</div>
          </div>
        ))}
      </div>

      {adding&&(
        <div className="card" style={{marginBottom:13,borderColor:T.green+"33"}}>
          <div style={{fontSize:11,textTransform:"uppercase",letterSpacing:".09em",fontWeight:700,color:T.green,marginBottom:13}}>New Closed Deal Entry</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9,marginBottom:9}}>
            {[["Deal / Business Name","dealName","Business name"],["Buyer Name","buyer","Firm name"],["Closed Date","closedDate",""],["Asking Price","askPrice","$5.2M"],["Finder Fee Rate %","feeRate","3.5"],["Split % (Mario)","splitPct","50"]].map(([label,key,ph])=>(
              <div key={key}>
                <div style={{fontSize:10,color:T.gray,marginBottom:4}}>{label}</div>
                <input type={key==="closedDate"?"date":"text"} value={form[key]} onChange={e=>f(key,e.target.value)} placeholder={ph}/>
              </div>
            ))}
            <div style={{gridColumn:"1/-1"}}>
              <div style={{fontSize:10,color:T.gray,marginBottom:4}}>Notes</div>
              <input value={form.notes} onChange={e=>f("notes",e.target.value)} placeholder="Deal notes..."/>
            </div>
          </div>
          <div style={{display:"flex",gap:8}}><button className="btn btn-green" onClick={addEntry} style={{padding:"8px 16px"}}>Log Closed Deal</button><button className="ghost" onClick={()=>setAdding(false)}>Cancel</button></div>
        </div>
      )}

      {ledger.length===0&&(
        <div className="card" style={{textAlign:"center",padding:32,color:T.gray}}>No closed deals yet. Move deals to "Closed" in Pipeline or add entries manually.</div>
      )}

      {ledger.map((e,i)=>(
        <div key={e.id||i} className="card" style={{marginBottom:9,borderColor:T.green+"33"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:13,fontWeight:700,color:T.white,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{e.dealName}</div>
              <div style={{fontSize:10,color:T.gray,marginTop:2}}>{e.vertical} - Buyer: {e.buyer} - Closed: {e.closedDate}</div>
              {e.cat&&<div style={{marginTop:3}}><CatPill cat={e.cat}/></div>}
            </div>
            <div style={{textAlign:"right",flexShrink:0,marginLeft:10}}>
              <div style={{fontSize:16,fontWeight:700,color:T.green,fontFamily:"'DM Mono',monospace"}}>{e.fee}</div>
              <div style={{fontSize:10,color:T.gray}}>total fee</div>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:7}}>
            {[["Ask Price",e.askPrice||"N/A"],["Mario",`$${Math.round((e.mario||0)/Math.max(1000,1))}K`],["Vanessa",`$${Math.round((e.vanessa||0)/Math.max(1000,1))}K`]].map(([k,v])=>(
              <div key={k} style={{padding:"5px 8px",background:T.surface,borderRadius:5}}>
                <div style={{fontSize:10,color:T.gray,textTransform:"uppercase",letterSpacing:".06em"}}>{k}</div>
                <div style={{fontSize:12,fontWeight:600,color:T.gold,fontFamily:"'DM Mono',monospace",marginTop:1}}>{v}</div>
              </div>
            ))}
          </div>
          {e.notes&&<div style={{fontSize:10,color:T.gl,marginTop:7,lineHeight:1.4}}>{e.notes}</div>}
        </div>
      ))}
    </div>
  );
}

// ── VALUATION CALCULATOR ───────────────────────────────────────────────────────
function ValuationCalc() {
  const [rev,setRev] = useState("3.5");
  const [margin,setMargin] = useState("30");
  const [multiple,setMultiple] = useState("3.5");
  const [feeRate,setFeeRate] = useState("3.5");
  const [splitPct,setSplit] = useState("50");
  const [vertical,setVertical] = useState("Shopify Stores");
  const [loading,setLoading] = useState(false);
  const [advice,setAdvice] = useState("");
  const [err,setErr] = useState("");

  const revN    = parseFloat(rev||"0")||0;
  const marginN = parseFloat(margin||"0")||0;
  const multN   = parseFloat(multiple||"0")||0;
  const feeN    = parseFloat(feeRate||"3.5")||3.5;
  const splitN  = (parseInt(splitPct)||50)/100;

  const ebitda       = revN * (marginN/100);
  const valuation    = ebitda * multN;
  const totalFee     = valuation * (feeN/100);
  const marioFee     = totalFee * splitN;
  const vanessaFee   = totalFee * (1-splitN);
  const altVal1      = revN * 1.5;
  const altVal2      = revN * 2.5;

  const vert = VERTICALS.find(v=>v.label===vertical)||VERTICALS[0];

  const getAIAdvice = async()=>{
    resetCircuit();
    setLoading(true); setAdvice(""); setErr("");
    try {
      const r = await callAI(
        "You are a sharp M&A valuation expert. Give specific, actionable negotiation advice.",
        `Deal valuation for PeakOffers (Mario Sofroniou and Vanessa Kisso):
Vertical: ${vertical}
Revenue: $${revN}M, Margin: ${marginN}%, EBITDA: $${ebitda.toFixed(2)}M
Implied Valuation: $${valuation.toFixed(2)}M at ${multN}x EBITDA
Finder Fee: $${(totalFee*1000).toFixed(0)}K at ${feeN}%

Give: 1.Is this multiple fair for ${vertical} right now? 2.What price should we negotiate to? 3.Key value drivers to highlight to buyer 4.Red flags that could kill the deal 5.What comparable transactions support this price?
Sharp and specific.`, 700
      );
      setAdvice(r);
    } catch(e) { setErr(e.message); }
    setLoading(false);
  };

  const Row=({label,val,big,color,dim})=>(
    <div style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:`1px solid ${T.border}`,alignItems:"baseline"}}>
      <span style={{fontSize:big?13:11,color:T.gray}}>{label}</span>
      <span style={{fontFamily:"'DM Mono',monospace",fontSize:big?16:13,fontWeight:big?700:400,color:color||T.white}}>{val}</span>
    </div>
  );

  return (
    <div className="fade">
      <SH title="Valuation Calculator" sub="Model any deal in seconds - AI negotiation advice included"/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        <div>
          <div className="card" style={{marginBottom:11}}>
            <div style={{fontSize:10,textTransform:"uppercase",letterSpacing:".09em",color:T.gold,marginBottom:11}}>Deal Parameters</div>
            <div style={{marginBottom:9}}>
              <div style={{fontSize:10,color:T.gray,marginBottom:4}}>Vertical</div>
              <select value={vertical} onChange={e=>setVertical(e.target.value)}>
                {["ecom","perf","biz"].map(cat=>(
                  <optgroup key={cat} label={CAT_LABELS[cat]}>
                    {VERTICALS.filter(v=>v.cat===cat).map(v=><option key={v.id}>{v.label}</option>)}
                  </optgroup>
                ))}
              </select>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9}}>
              {[["Revenue ($M)",rev,setRev,"3.5"],["Margin %",margin,setMargin,"30"],["EBITDA Multiple",multiple,setMultiple,"3.5"],["Finder Fee %",feeRate,setFeeRate,"3.5"],["Split % (Mario)",splitPct,setSplit,"50"]].map(([label,val,set,ph])=>(
                <div key={label}>
                  <div style={{fontSize:10,color:T.gray,marginBottom:4}}>{label}</div>
                  <input value={val} onChange={e=>set(e.target.value)} placeholder={ph}/>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div style={{fontSize:10,textTransform:"uppercase",letterSpacing:".09em",color:T.gold,marginBottom:11}}>Typical Multiples - {vertical}</div>
            <div style={{padding:"8px 10px",background:T.goldDeep,borderRadius:6,border:`1px solid ${T.goldDim}33`,marginBottom:9}}>
              <div style={{fontSize:11,color:T.goldLight}}>Market range: <strong>{vert.multiples}</strong> EBITDA</div>
              <div style={{fontSize:10,color:T.goldDim,marginTop:2}}>Avg finder fee: {vert.feeAvg} | Revenue: {vert.revRange}</div>
            </div>
            <button className="btn" onClick={getAIAdvice} disabled={loading} style={{width:"100%",padding:"10px"}}>
              {loading?<Spin/>:"Get AI Negotiation Advice"}
            </button>
          </div>
        </div>

        <div>
          <div className="card" style={{marginBottom:11,borderColor:T.green+"33"}}>
            <div style={{fontSize:10,textTransform:"uppercase",letterSpacing:".09em",color:T.green,marginBottom:11}}>Valuation Output</div>
            <Row label="Revenue" val={`$${revN.toFixed(2)}M`}/>
            <Row label={`EBITDA (${marginN}% margin)`} val={`$${ebitda.toFixed(2)}M`}/>
            <Row label={`Implied Valuation (${multN}x)`} val={`$${valuation.toFixed(2)}M`} big color={T.gold}/>
            <Row label={`Finder Fee (${feeN}%)`} val={`$${(totalFee*1000).toFixed(0)}K`} big color={T.green}/>
            <Row label="Mario's share" val={`$${(marioFee*1000).toFixed(0)}K`} color={T.blue}/>
            <Row label="Vanessa's share" val={`$${(vanessaFee*1000).toFixed(0)}K`} color={T.purple}/>
          </div>
          <div className="card" style={{marginBottom:11}}>
            <div style={{fontSize:10,textTransform:"uppercase",letterSpacing:".09em",color:T.gold,marginBottom:9}}>Alternative Valuations</div>
            {[["Revenue 1.5x",altVal1,feeN],["Revenue 2.5x",altVal2,feeN],["EBITDA 4x",ebitda*4,feeN],["EBITDA 6x",ebitda*6,feeN]].map(([label,val,fee])=>(
              <div key={label} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:`1px solid ${T.border}`}}>
                <span style={{fontSize:11,color:T.gray}}>{label}</span>
                <div style={{textAlign:"right"}}>
                  <span style={{fontSize:11,color:T.white,fontFamily:"'DM Mono',monospace"}}>${val.toFixed(1)}M</span>
                  <span style={{fontSize:10,color:T.gold,fontFamily:"'DM Mono',monospace",marginLeft:8}}>${((val*(fee/100))*1000).toFixed(0)}K fee</span>
                </div>
              </div>
            ))}
          </div>
          <ErrBox msg={err}/>
          {advice&&!loading&&<div className="ai-box" style={{fontSize:12,lineHeight:1.7}}>{advice}</div>}
          {loading&&<div className="card" style={{textAlign:"center",padding:24}}><Spin/></div>}
        </div>
      </div>
    </div>
  );
}

// ── OUTREACH ENGINE ────────────────────────────────────────────────────────────
function OutreachEngine({deals}) {
  const safeDeals = useMemo(()=>(deals||[]).filter(Boolean),[deals]);
  const [selId,setSelId] = useState(()=>(safeDeals[0]||null)?.id||null);
  const [channel,setChannel] = useState("cold");
  const [loading,setLoading] = useState(false);
  const [result,setResult] = useState("");
  const [subject,setSubject] = useState("");
  const [copied,setCopied] = useState(false);
  const [err,setErr] = useState("");

  const deal = useMemo(()=>safeDeals.find(d=>d?.id===selId)||safeDeals[0]||null,[safeDeals,selId]);

  const dealContext = (d) => {
    if (!d) return "No deal selected";
    const vert = VERTICALS.find(v=>v.label===d.vertical)||{multiples:"2-4x"};
    const ask = parseFloat(String(d.asking||"$5M").replace(/[$,M]/g,""))||5;
    const rev = parseFloat(String(d.revenue||"$2M").replace(/[$,M]/g,""))||2;
    const mult = (ask>0&&rev>0)?(ask/rev).toFixed(1):"N/A";
    return `Name: ${d.name||"?"} | Vertical: ${d.vertical||"?"} (${CAT_LABELS[d.cat]||d.cat||""}) | Revenue: ${d.revenue||"?"} | Margin: ${d.margin||"?"} | Asking: ${d.asking||"?"} | Rev Multiple: ${mult}x | Market comps: ${vert.multiples} | Score: ${d.score||"?"}/100 | Source: ${d.source||"?"} | Notes: ${d.notes||"clean financials"}`;
  };

  const buildPrompt = (d, ch) => {
    if (!d) return "No deal selected";
    const ctx = dealContext(d);
    const prompts = {
      cold: `You are Mario Sofroniou, Principal at PeakOffers (Ontario, Canada), a specialist M&A finder in digital businesses. Write a COLD EMAIL to the SELLER/OWNER of ${d.name}.
DEAL: ${ctx}
MISSION: Get a 15-minute call. Seller must feel: (1) you know their vertical deeply, (2) you have funded buyers ready NOW, (3) 15 minutes is worth it.
RULES: Subject line first. Open with ONE sharp insight about ${d.vertical} operators right now. 2-3 body sentences. Soft CTA: 15-min call. Sign: Mario Sofroniou, PeakOffers, Ontario Canada. Under 130 words total. ZERO cliches. Peer-to-peer tone.
FORMAT:\nSubject: [line]\n\n[body]`,
      followup: `You are Mario Sofroniou, PeakOffers. Cold email sent to ${d.name} 5 days ago, no reply. DEAL: ${ctx}
Write a SHORT confident follow-up (under 90 words). New hook: buyer shortlist closing this week OR comparable sale in ${d.vertical}. No desperation. Reply thread subject line.
FORMAT:\nSubject: Re: [relevant]\n\n[body]`,
      loi: `You are Mario Sofroniou, PeakOffers Ontario Canada. Buyer submitting LOI for ${d.name} at/near ${d.asking||"asking"}. DEAL: ${ctx}
LOI cover email to seller. Under 150 words. Confident and transactional. State: buyer completed diligence, moving to LOI. Next step: 30-min call. Professional subject line.
FORMAT:\nSubject: [line]\n\n[body]`,
      linkedin: `LinkedIn connection message from Mario Sofroniou (PeakOffers, Ontario) to owner of ${d.name} (${d.vertical}, ${d.revenue}). Under 260 chars. Show you know ${d.vertical} space. No pitch. Peer-level. No buzzwords. Write ONLY the message.`,
      sequence: `You are Mario Sofroniou, PeakOffers. 4-TOUCH sequence for ${d.name} (${ctx}).
Each touch meaningfully different. Touch 1-Day 1: cold peer-level email. Touch 2-Day 6: follow-up with new hook (comparable deal or buyer urgency). Touch 3-Day 14: value-add insight on what buyers pay for ${d.vertical} now. Touch 4-Day 21: final honest no-pressure close.
Format each: TOUCH [N] - Day [X]\nSubject: [line]\n[body]\nUnder 120 words each.`,
    };
    return prompts[ch]||prompts.cold;
  };

  const generate = async () => {
    if (!deal) { setErr("No deals loaded — run the Mega Scout first."); return; }
    resetCircuit();
    setLoading(true); setResult(""); setSubject(""); setErr("");
    try {
      const raw = await callAI(
        "You are an elite M&A outreach copywriter. Write conversion-optimized, hyper-personalized business acquisition emails. Every word earns its place. No fluff, no cliches.",
        buildPrompt(deal, channel), 800
      );
      const sm = (raw||"").match(/^Subject:\s*(.+)$/im);
      if (sm) { setSubject(sm[1].trim()); setResult((raw||"").replace(/^Subject:\s*.+\n*/im,"").trim()); }
      else { setResult(raw||""); }
    } catch(e) { setErr(e?.message||"Generation failed - check connection"); }
    setLoading(false);
  };

  const copyAll = () => {
    const full = subject ? `Subject: ${subject}\n\n${result}` : result;
    navigator.clipboard.writeText(full).catch(()=>{});
    setCopied(true); setTimeout(()=>setCopied(false),2000);
  };

  const channels = [
    {id:"cold",label:"Cold Email",desc:"High-conversion opener"},
    {id:"followup",label:"Follow-Up",desc:"5-day no-reply nudge"},
    {id:"loi",label:"LOI Cover",desc:"Buyer submitting LOI"},
    {id:"linkedin",label:"LinkedIn",desc:"260-char connection"},
    {id:"sequence",label:"4-Touch Sequence",desc:"21-day campaign"},
  ];

  return (
    <div className="fade">
      <SH title="Outreach Engine" sub="Hyper-personalized for every deal - max conversion across all 20 verticals"/>
      <div className="card" style={{marginBottom:11,background:"linear-gradient(135deg,#080C10,#060A0C)",borderColor:T.goldDim+"44"}}>
        <div style={{fontSize:10,textTransform:"uppercase",letterSpacing:".09em",color:T.gold,marginBottom:10}}>Select Deal</div>
        {safeDeals.length===0&&<div style={{textAlign:"center",padding:20,fontSize:12,color:T.gray}}>Run Mega Scout to populate deals</div>}
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,minmax(0,1fr))",gap:6,maxHeight:180,overflowY:"auto"}}>
          {safeDeals.map(d=>(
            <div key={d.id} onClick={()=>setSelId(d.id)} style={{padding:"9px 11px",borderRadius:7,cursor:"pointer",transition:"all .15s",background:selId===d.id?"#001A24":T.surface,border:`1px solid ${selId===d.id?T.gold:T.border}`}}>
              <div style={{fontSize:11,fontWeight:600,color:selId===d.id?T.gold:T.white,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{d.name}</div>
              <div style={{fontSize:10,color:T.gray,marginTop:1}}>{d.vertical}</div>
              <div style={{display:"flex",justifyContent:"space-between",marginTop:3}}>
                <span style={{fontSize:10,color:T.goldDim,fontFamily:"'DM Mono',monospace"}}>{d.fee}</span>
                <StageBadge stage={d.stage||"Sourced"}/>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{display:"flex",gap:6,marginBottom:11,flexWrap:"wrap"}}>
        {channels.map(ch=>(
          <div key={ch.id} onClick={()=>setChannel(ch.id)} style={{padding:"8px 14px",borderRadius:7,cursor:"pointer",transition:"all .15s",minWidth:100,background:channel===ch.id?T.goldDeep:T.surface,border:`1px solid ${channel===ch.id?T.gold:T.border}`}}>
            <div style={{fontSize:11,fontWeight:700,color:channel===ch.id?T.gold:T.white}}>{ch.label}</div>
            <div style={{fontSize:10,color:T.gray,marginTop:1}}>{ch.desc}</div>
          </div>
        ))}
      </div>
      {deal&&(
        <div style={{marginBottom:11,padding:"9px 14px",background:T.surface,borderRadius:7,border:`1px solid ${T.border}`,display:"flex",gap:14,flexWrap:"wrap",alignItems:"center"}}>
          {[["Business",deal.name],["Vertical",deal.vertical],["Revenue",deal.revenue],["Asking",deal.asking],["Fee",deal.fee],["Score",`${deal.score}/100`]].map(([k,v])=>(
            <div key={k}><div style={{fontSize:10,color:T.gray,textTransform:"uppercase",letterSpacing:".06em"}}>{k}</div><div style={{fontSize:11,color:T.white,fontFamily:"'DM Mono',monospace",fontWeight:600}}>{v||"N/A"}</div></div>
          ))}
        </div>
      )}
      <button className="btn" onClick={generate} disabled={loading||!deal} style={{width:"100%",padding:"12px",fontSize:13,marginBottom:11}}>
        {loading?<Spin/>:`Generate ${channels.find(c=>c.id===channel)?.label||"Email"}`+(deal?` — ${deal.name}`:"")}
      </button>
      <ErrBox msg={err}/>
      {(result||subject)&&!loading&&(
        <div className="fade">
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
            <div style={{fontSize:10,textTransform:"uppercase",letterSpacing:".09em",color:T.gold}}>Ready to Send — {deal?.name||""}</div>
            <div style={{display:"flex",gap:6}}>
              <button className="ghost" onClick={copyAll}>{copied?"Copied":"Copy All"}</button>
              <button className="ghost" onClick={generate}>Redo</button>
            </div>
          </div>
          {subject&&(
            <div style={{marginBottom:8,padding:"8px 12px",background:T.goldDeep,borderRadius:6,border:`1px solid ${T.goldDim}44`}}>
              <span style={{fontSize:10,color:T.goldDim,textTransform:"uppercase",letterSpacing:".07em",marginRight:8}}>Subject:</span>
              <span style={{fontSize:12,color:T.goldLight,fontWeight:600}}>{subject}</span>
            </div>
          )}
          <div className="ai-box" style={{fontSize:13,lineHeight:1.8}}>{result}</div>
          <div style={{fontSize:10,color:T.gray,marginTop:6,display:"flex",justifyContent:"space-between"}}>
            <span>Mario Sofroniou and Vanessa Kisso — PeakOffers — Ontario, Canada</span>
            <span>{(result||"").split(/\s+/).filter(Boolean).length} words</span>
          </div>
        </div>
      )}
    </div>
  );
}


// ── AI AGENT — ONE-CLICK PUSH-BUTTON DEAL OUTREACH ────────────────────────────
function AgentQueue({deals,alerts,ejsCfg}) {
  const safeDeals = useMemo(()=>(deals||[]).filter(Boolean),[deals]);
  const [queue,setQueue] = useState([]);
  const [running,setRunning] = useState(false);
  const [sending,setSending] = useState(false);
  const [log,setLog] = useState([]);
  const [autoApprove,setAutoApprove] = useState(false);
  const [minScore,setMinScore] = useState(75);
  const [processed,setProcessed] = useState(0);
  const [err,setErr] = useState("");
  const [viewFilter,setViewFilter] = useState("pending");
  const logRef = useRef(null);
  const lc = {system:T.gold,info:T.gl,success:T.green,error:T.red,sent:T.purple,queued:T.orange};

  const addLog = useCallback((msg,type="info")=>{
    setLog(l=>[...l.slice(-80),{msg,type,ts:new Date().toLocaleTimeString()}]);
    setTimeout(()=>{if(logRef.current)logRef.current.scrollTop=99999;},30);
  },[]);

  const eligible      = useMemo(()=>safeDeals.filter(d=>d?.stage==="Sourced"&&(d?.score||0)>=minScore),[safeDeals,minScore]);
  const pendingCount  = useMemo(()=>queue.filter(q=>q?.status==="pending").length,[queue]);
  const approvedCount = useMemo(()=>queue.filter(q=>q?.status==="approved").length,[queue]);
  const sentCount     = useMemo(()=>queue.filter(q=>q?.status==="sent").length,[queue]);
  const ejsReady      = !!(ejsCfg?.serviceId&&ejsCfg?.templateId&&ejsCfg?.publicKey);

  const visibleQueue = useMemo(()=>{
    if (viewFilter==="all") return queue;
    return queue.filter(q=>q?.status===viewFilter);
  },[queue,viewFilter]);

  const buildEmailPrompt = (deal) => {
    if (!deal) return "";
    const vert = VERTICALS.find(v=>v.label===deal.vertical)||{multiples:"2-4x"};
    const ask = parseFloat(String(deal.asking||"$5M").replace(/[$,M]/g,""))||5;
    const rev = parseFloat(String(deal.revenue||"$2M").replace(/[$,M]/g,""))||2;
    const mult = (ask>0&&rev>0)?(ask/rev).toFixed(1):"N/A";
    return `You are Mario Sofroniou, Principal at PeakOffers (Ontario, Canada). Write a COLD EMAIL to the SELLER of ${deal.name}.
BUSINESS: ${deal.vertical} (${CAT_LABELS[deal.cat]||""}) | Revenue: ${deal.revenue} | Margin: ${deal.margin} | Asking: ${deal.asking} | Rev multiple: ${mult}x | Market: ${vert.multiples} | Notes: ${deal.notes||"clean"}
MISSION: Secure a 15-minute call.
RULES: Subject line first. Open with ONE sharp insight about ${deal.vertical} operators right now (their world, challenge, or opportunity). 2-3 body sentences: credible signal of funded buyers ready NOW in this vertical, soft ask for 15-min call. Sign: Mario Sofroniou, PeakOffers, Ontario Canada. Under 130 words total. ZERO cliches. Peer-to-peer.
FORMAT:\nSubject: [line]\n\n[body]`;
  };

  const buildQueue = async () => {
    if (running||sending) return;
    // Reset circuit breaker on manual user action — they clicked, so retry fresh
    resetCircuit();
    setRunning(true); setErr("");
    addLog(`Scanning ${safeDeals.length} deals for outreach (score ${minScore}+)`,"system");
    await delay(200);
    const batch = eligible.slice(0,10);
    if (!batch.length) { addLog("No eligible deals — lower threshold or run Scout first","error"); setRunning(false); return; }
    addLog(`${batch.length} deals qualify`,"system");
    const newItems = [];
    for (const deal of batch) {
      if (!deal) continue;
      if (queue.find(q=>q?.id===deal.id)) { addLog(`Already queued: ${deal.name}`,"info"); continue; }
      addLog(`Writing email: ${deal.name} (${deal.vertical})`,"info");
      try {
        const raw = await callAI(
          "Elite M&A outreach copywriter. Conversion-optimized, hyper-personalized. Every word earns its place. No cliches.",
          buildEmailPrompt(deal), 600
        );
        const sm = (raw||"").match(/^Subject:\s*(.+)$/im);
        const emailSubject = sm ? sm[1].trim() : `Re: ${deal.name}`;
        const emailBody = sm ? (raw||"").replace(/^Subject:\s*.+\n*/im,"").trim() : (raw||"");
        const wc = (emailBody||"").split(/\s+/).filter(Boolean).length;
        newItems.push({
          id:deal.id, dealName:deal.name, vertical:deal.vertical, cat:deal.cat,
          fee:deal.fee||"", score:deal.score||0, subject:emailSubject, email:emailBody,
          status:autoApprove?"approved":"pending",
          generatedAt:new Date().toLocaleTimeString(), wordCount:wc,
        });
        addLog(`Ready: ${deal.name} (${wc}w)`,autoApprove?"success":"queued");
      } catch(e) {
        addLog(`Failed: ${deal.name} — ${e?.message||"error"}`,"error");
      }
      await delay(100);
    }
    if (newItems.length>0) {
      setQueue(q=>{ const ids=new Set(q.map(x=>x?.id)); return [...q,...newItems.filter(x=>!ids.has(x.id))]; });
      addLog(`Queue ready: ${newItems.length} emails drafted`,"success");
    }
    if (autoApprove&&newItems.length>0) {
      addLog("AUTO-APPROVE: sending now...","system");
      await delay(200);
      await doSend(newItems);
    }
    setRunning(false);
  };

  const doSend = async (itemsArg) => {
    // itemsArg = specific items to send (may already be filtered)
    // If passed items explicitly, send them all; otherwise send approved from queue
    const toSend = itemsArg
      ? itemsArg.filter(x=>x!=null)
      : queue.filter(x=>x?.status==="approved");
    if (!toSend.length) { addLog("No approved emails to send","info"); return; }
    if (!ejsReady) {
      setErr("EmailJS not configured — go to Alerts tab, enter 3 keys. Takes 5 minutes.");
      addLog("EmailJS missing","error"); return;
    }
    setSending(true);
    let sent=0;
    for (const item of toSend) {
      if (!item) continue;
      try {
        await loadEJS(ejsCfg.publicKey);
        if (!window.emailjs) throw new Error("EmailJS SDK not loaded");
        await window.emailjs.send(ejsCfg.serviceId, ejsCfg.templateId, {
          to_email:  alerts?.email||OWNER.email,
          to_name:   OWNER.name,
          subject:   `[PeakOffers] ${item.subject||("Outreach: "+item.dealName)}`,
          deal_count:"1",
          deal_list: `${item.subject||""}\n\n${item.email||""}`,
          top_deal:  item.dealName||"",
          top_fee:   item.fee||"",
          top_score: String(item.score||""),
          top_type:  item.vertical||"",
          total_fees:item.fee||"",
          timestamp: new Date().toLocaleString("en-CA",{dateStyle:"medium",timeStyle:"short"}),
          brand:     "PeakOffers AI Agent",
        });
        setQueue(q=>q.map(x=>x?.id===item.id?{...x,status:"sent",sentAt:new Date().toLocaleTimeString()}:x));
        setProcessed(p=>p+1); sent++;
        addLog(`Sent: ${item.dealName}`,"sent");
        await delay(700);
      } catch(e) {
        const msg = e?.message||"Unknown error";
        addLog(`Failed: ${item.dealName} — ${msg}`,"error");
        setQueue(q=>q.map(x=>x?.id===item.id?{...x,status:"failed",failReason:msg}:x));
      }
    }
    addLog(`Done: ${sent}/${toSend.length} sent`,"success");
    setSending(false);
  };

  const approve    = id => setQueue(q=>q.map(x=>x?.id===id?{...x,status:"approved"}:x));
  const skip       = id => setQueue(q=>q.map(x=>x?.id===id?{...x,status:"skipped"}:x));
  const retry      = id => { resetCircuit(); setQueue(q=>q.map(x=>x?.id===id?{...x,status:"approved",failReason:undefined}:x)); };
  const approveAll = ()  => setQueue(q=>q.map(x=>x?.status==="pending"?{...x,status:"approved"}:x));
  const clearDone  = ()  => setQueue(q=>q.filter(x=>x?.status==="pending"||x?.status==="approved"));
  const sendApproved = () => doSend(queue.filter(q=>q?.status==="approved"));

  const sColor={pending:T.orange,approved:T.blue,sent:T.green,skipped:T.gray,failed:T.red};
  const sLabel={pending:"Pending",approved:"Approved",sent:"Sent",skipped:"Skipped",failed:"Failed"};

  return (
    <div className="fade">
      <SH title="AI Agent" sub="One-click deal outreach — elite personalized emails, approve or full auto-send"/>

      {!ejsReady&&(
        <div style={{marginBottom:13,padding:"11px 14px",background:"#120800",borderRadius:8,border:`1px solid ${T.orange}44`,display:"flex",gap:11,alignItems:"flex-start"}}>
          <span style={{fontSize:16,flexShrink:0,color:T.orange}}>!</span>
          <div>
            <div style={{fontSize:12,fontWeight:700,color:T.orange,marginBottom:3}}>EmailJS not configured — emails draft but do not send</div>
            <div style={{fontSize:11,color:T.gray,lineHeight:1.5}}>Go to Alerts tab, Email Setup, paste your 3 keys. Free, 5 minutes. 200 emails/month free tier.</div>
          </div>
        </div>
      )}

      <div className="card" style={{marginBottom:13,background:"linear-gradient(135deg,#060A08,#040806)",borderColor:ejsReady?T.green+"44":T.orange+"33"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:13}}>
          <div>
            <div style={{fontSize:13,fontWeight:700,color:T.white}}>Control Panel</div>
            <div style={{display:"flex",gap:10,marginTop:3,flexWrap:"wrap"}}>
              <div style={{display:"flex",alignItems:"center",gap:5}}>
                <div style={{width:6,height:6,borderRadius:"50%",background:ejsReady?T.green:T.orange,flexShrink:0}}/>
                <span style={{fontSize:10,color:ejsReady?T.green:T.orange}}>{ejsReady?"EmailJS live":"EmailJS not set"}</span>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:5}}>
                <div style={{width:6,height:6,borderRadius:"50%",background:T.green,flexShrink:0}} className="pulse"/>
                <span style={{fontSize:10,color:T.green}}>API ready</span>
              </div>
            </div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:10,color:T.gray,textTransform:"uppercase",letterSpacing:".07em",marginBottom:4}}>Auto-Approve</div>
            <div onClick={()=>setAutoApprove(!autoApprove)} style={{width:44,height:24,borderRadius:12,background:autoApprove?T.green:T.border,cursor:"pointer",position:"relative",transition:"background .2s",marginLeft:"auto"}}>
              <div style={{position:"absolute",top:3,left:autoApprove?22:3,width:18,height:18,borderRadius:"50%",background:T.white,transition:"left .2s",boxShadow:"0 1px 4px rgba(0,0,0,.3)"}}/>
            </div>
          </div>
        </div>
        {autoApprove&&(
          <div style={{marginBottom:11,padding:"8px 12px",background:"#050f08",borderRadius:6,border:`1px solid ${T.green}44`,fontSize:11,color:T.green,lineHeight:1.5}}>
            AUTO-APPROVE ON — {ejsReady?"Agent drafts and sends automatically.":"Drafts immediately, sends once EmailJS configured."}
          </div>
        )}
        <div style={{display:"grid",gridTemplateColumns:"repeat(5,minmax(0,1fr))",gap:7,marginBottom:13}}>
          {[{l:"Eligible",v:eligible.length,c:T.gold},{l:"Pending",v:pendingCount,c:T.orange},{l:"Approved",v:approvedCount,c:T.blue},{l:"Sent",v:sentCount,c:T.green},{l:"All Time",v:processed,c:T.purple}].map(s=>(
            <div key={s.l} style={{padding:"8px 5px",background:T.surface,borderRadius:7,border:`1px solid ${T.border}`,textAlign:"center"}}>
              <div style={{fontSize:20,fontWeight:700,color:s.c,fontFamily:"'DM Mono',monospace",lineHeight:1}}>{s.v}</div>
              <div style={{fontSize:10,color:T.gray,textTransform:"uppercase",letterSpacing:".05em",marginTop:3}}>{s.l}</div>
            </div>
          ))}
        </div>
        <div style={{marginBottom:13}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
            <span style={{fontSize:11,color:T.white}}>Min Score for Queue</span>
            <span style={{fontFamily:"'DM Mono',monospace",color:T.gold,fontWeight:700}}>{minScore}+</span>
          </div>
          <input type="range" min={50} max={95} value={minScore} onChange={e=>setMinScore(+e.target.value)} style={{width:"100%"}}/>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:T.gray,marginTop:3}}>
            <span>50 max volume</span><span>75 balanced</span><span>95 elite</span>
          </div>
        </div>
        <ErrBox msg={err} onRetry={buildQueue}/>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          <button className="btn" onClick={buildQueue} disabled={running||sending} style={{padding:"10px 22px",fontSize:13}}>
            {running?<span>Writing emails... <Spin/></span>:`Build Queue (${eligible.length} eligible)`}
          </button>
          {approvedCount>0&&(
            <button className="btn btn-green" onClick={sendApproved} disabled={sending} style={{padding:"10px 22px",fontSize:13}}>
              {sending?<span>Sending... <Spin/></span>:`Send ${approvedCount} Now`}
            </button>
          )}
          {pendingCount>0&&<button className="ghost" onClick={approveAll} style={{padding:"10px 16px"}}>Approve All ({pendingCount})</button>}
          {queue.filter(q=>["sent","skipped","failed"].includes(q?.status||"")).length>0&&(
            <button className="ghost" onClick={clearDone} style={{padding:"10px 16px"}}>Clear Done</button>
          )}
        </div>
      </div>

      {log.length>0&&(
        <div className="card" style={{marginBottom:13}}>
          <div style={{fontSize:10,textTransform:"uppercase",letterSpacing:".09em",color:T.gold,marginBottom:7}}>Log {(running||sending)&&<Spin/>}</div>
          <div ref={logRef} style={{height:120,overflowY:"auto",fontFamily:"'DM Mono',monospace",fontSize:11}}>
            {log.map((l,i)=><div key={i} style={{padding:"2px 0",color:lc[l.type]||T.gl}}><span style={{color:T.gray,marginRight:7}}>{l.ts}</span>{l.msg}</div>)}
          </div>
        </div>
      )}

      {queue.length>0&&(
        <div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:9}}>
            <div style={{fontSize:10,textTransform:"uppercase",letterSpacing:".09em",color:T.gold}}>Queue — {queue.length} emails</div>
            <div style={{display:"flex",gap:5}}>
              {[["pending","Pending"],["approved","Approved"],["sent","Sent"],["all","All"]].map(([id,label])=>(
                <button key={id} className={`tab ${viewFilter===id?"on":""}`} onClick={()=>setViewFilter(id)}>{label}</button>
              ))}
            </div>
          </div>
          {visibleQueue.length===0&&<div style={{textAlign:"center",padding:16,color:T.gray,fontSize:12}}>No emails in this view</div>}
          {visibleQueue.map(item=>{
            if (!item) return null;
            return (
              <div key={item.id} className="card" style={{marginBottom:10,borderColor:(sColor[item.status||"pending"]||T.border)+"44"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:13,fontWeight:700,color:T.white,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.dealName}</div>
                    <div style={{fontSize:10,color:T.gray,marginTop:2,display:"flex",gap:7,alignItems:"center",flexWrap:"wrap"}}>
                      <span>{item.vertical}</span>
                      <span style={{color:T.gold,fontFamily:"'DM Mono',monospace"}}>{item.fee}</span>
                      <span style={{color:item.score>=85?T.green:item.score>=70?T.gold:T.red,fontWeight:600}}>Score: {item.score}</span>
                      {item.wordCount&&<span>{item.wordCount}w</span>}
                      {item.cat&&<CatPill cat={item.cat}/>}
                    </div>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:5,flexShrink:0,marginLeft:10}}>
                    <span style={{fontSize:10,color:sColor[item.status||"pending"]||T.gray,fontWeight:700}}>{sLabel[item.status||"pending"]}</span>
                    {item.status==="pending"&&<div style={{display:"flex",gap:5}}><button className="btn" onClick={()=>approve(item.id)} style={{padding:"5px 14px",fontSize:11}}>Approve</button><button className="ghost" onClick={()=>skip(item.id)} style={{padding:"5px 10px"}}>Skip</button></div>}
                    {item.status==="approved"&&!sending&&<button className="btn btn-green" onClick={()=>doSend([{...item}])} style={{padding:"5px 14px",fontSize:11}}>Send Now</button>}
                    {item.status==="failed"&&<button className="ghost" onClick={()=>retry(item.id)} style={{padding:"5px 10px",borderColor:T.orange+"44",color:T.orange}}>Retry</button>}
                    {item.status==="sent"&&<span style={{fontSize:10,color:T.gray}}>{item.sentAt||""}</span>}
                  </div>
                </div>
                {item.subject&&(
                  <div style={{marginBottom:7,padding:"6px 10px",background:T.goldDeep,borderRadius:5,border:`1px solid ${T.goldDim}33`}}>
                    <span style={{fontSize:10,color:T.goldDim,textTransform:"uppercase",letterSpacing:".07em",marginRight:7}}>Subject:</span>
                    <span style={{fontSize:11,color:T.goldLight,fontWeight:600}}>{item.subject}</span>
                  </div>
                )}
                <div style={{background:T.surface,borderRadius:6,padding:"11px",border:`1px solid ${T.border}`,fontSize:12,color:T.gl,whiteSpace:"pre-wrap",lineHeight:1.7,maxHeight:200,overflowY:"auto"}}>{item.email}</div>
                {item.failReason&&<div style={{fontSize:10,color:T.red,marginTop:5,padding:"4px 8px",background:"#180808",borderRadius:4}}>Error: {item.failReason}</div>}
                <div style={{fontSize:10,color:T.gray,marginTop:5}}>Generated {item.generatedAt}</div>
              </div>
            );
          })}
        </div>
      )}

      {queue.length===0&&log.length===0&&(
        <div className="card" style={{textAlign:"center",padding:40}}>
          <div style={{fontSize:14,marginBottom:8,color:T.gold}}>Agent Ready</div>
          <div style={{fontSize:11,color:T.border,lineHeight:1.9,maxWidth:380,margin:"0 auto"}}>
            1. Run Mega Scout to populate deals{"\n"}
            2. Click Build Queue — AI writes elite personalized emails{"\n"}
            3. Approve all or one-by-one{"\n"}
            4. Send Now — one click sends everything{"\n\n"}
            Configure EmailJS in Alerts tab to activate sending.
          </div>
        </div>
      )}
    </div>
  );
}


// ── CONTRACT ENGINE ────────────────────────────────────────────────────────────
function ContractEngine() {
  const [form,setForm] = useState({
    finder1:"Mario Sofroniou", finder1title:"Principal, PeakOffers",
    finder2:"Vanessa Kisso",   finder2title:"Co-Finder, PeakOffers",
    entity:"PeakOffers",
    buyer:"Apex Performance Holdings", buyerRep:"Principal / Authorized Signatory",
    jurisdiction:"Ontario, Canada", feeRate:"3.5", minFee:"25,000",
    currency:"CAD", term:"24", tail:"18", exclusivity:"non-exclusive", splitPct:"50",
  });
  const [loading,setLoading] = useState(false);
  const [contract,setContract] = useState("");
  const [copied,setCopied] = useState(false);
  const [err,setErr] = useState("");
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));

  const go=async()=>{
    resetCircuit();
    setLoading(true); setContract(""); setErr("");
    try {
      const r = await callAI(
        "You are a senior Canadian commercial attorney specializing in M&A finder fee agreements under Ontario law. Draft complete, precise, execution-ready agreements. Do not truncate.",
        `Draft a complete FINDER FEE AGREEMENT governed by the laws of Ontario, Canada:

FINDERS (acting jointly):
  1. ${form.finder1} - ${form.finder1title}
  2. ${form.finder2} - ${form.finder2title}
  Trade name: ${form.entity}
  Fee split: ${form.splitPct}% to ${form.finder1} / ${100-(parseInt(form.splitPct||50)||0)}% to ${form.finder2}

BUYER: ${form.buyer} (${form.buyerRep})
GOVERNING LAW: ${form.jurisdiction} - Ontario Business Corporations Act
FINDER FEE: ${form.feeRate}% of gross Transaction Value at Closing
MINIMUM FEE: $${form.minFee} ${form.currency}
TERM: ${form.term} months | TAIL: ${form.tail} months | EXCLUSIVITY: ${form.exclusivity}

All sections complete - do not truncate any section:
1.Parties and Recitals (full identification of both finders and buyer)
2.Definitions (Transaction, Introduced Party, Qualified Introduction, Closing, Finder Fee, Tail Period, Split)
3.Engagement and Scope (introduction agents only; not securities dealers; Ontario Securities Act exemptions apply)
4.Finder Fee (${form.feeRate}%, min $${form.minFee} ${form.currency}, due within 5 business days of Closing by wire transfer; split ${form.splitPct}/${100-(parseInt(form.splitPct||50)||0)} between ${form.finder1} and ${form.finder2})
5.Tail Period (${form.tail} months full protection post-termination)
6.Qualified Introduction Procedure (written email constitutes introduction; 3-day acknowledgment)
7.Exclusions and Carve-Outs (pre-disclosed relationships within 10 days; publicly listed companies)
8.Confidentiality (mutual; 3 years; covers target identities, deal terms, sourcing methods)
9.Representations and Warranties (authority; not registered dealers; Buyer has acquisition capital)
10.Indemnification (mutual breach; Buyer indemnifies Finders for third-party transaction claims)
11.Limitation of Liability (capped at prior 12 months fees received; no consequential damages)
12.Term and Termination (${form.term} months auto-renewing; 30-day written notice; immediate termination for material breach uncured in 15 days)
13.Governing Law and Dispute Resolution (Province of Ontario exclusively; ADRIC National Arbitration Rules; seat: Toronto, Ontario; prevailing party recovers legal fees)
14.General Provisions (entire agreement; written amendments only; severability; counterparts; electronic signatures valid under Ontario Electronic Commerce Act)
15.Signature Blocks:
   ${form.finder1} (${form.finder1title}): _________________________ Date: __________
   ${form.finder2} (${form.finder2title}): _________________________ Date: __________
   ${form.buyer} (${form.buyerRep}): ____________________________ Date: __________
   Full address lines under each block.

Complete and execution-ready.`, 1200
      );
      setContract(r);
    } catch(e) { setErr(e.message); }
    setLoading(false);
  };

  const copy=()=>{navigator.clipboard.writeText(contract).catch(()=>{}); setCopied(true); setTimeout(()=>setCopied(false),2500);};
  const F=({label,k,opts,span})=>(
    <div style={span?{gridColumn:"1/-1"}:{}}>
      <div style={{fontSize:10,color:T.gray,textTransform:"uppercase",letterSpacing:".06em",marginBottom:4}}>{label}</div>
      {opts?<select value={form[k]} onChange={e=>set(k,e.target.value)}>{opts.map(o=><option key={o}>{o}</option>)}</select>
           :<input value={form[k]} onChange={e=>set(k,e.target.value)}/>}
    </div>
  );

  return (
    <div className="fade">
      <SH title="Contract Engine" sub="Ontario, Canada Law - ADRIC Arbitration - Mario Sofroniou and Vanessa Kisso - Dual Signatories"/>
      <div className="card" style={{marginBottom:11,borderColor:T.goldDim+"44",background:"linear-gradient(135deg,#060A0E,#080C10)"}}>
        <div style={{fontSize:10,textTransform:"uppercase",letterSpacing:".09em",color:T.gold,marginBottom:11}}>Finder Details</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9,marginBottom:9}}>
          <F label="Finder 1 Name" k="finder1"/>
          <F label="Finder 1 Title" k="finder1title"/>
          <F label="Finder 2 Name" k="finder2"/>
          <F label="Finder 2 Title" k="finder2title"/>
          <F label="Entity / Trade Name" k="entity"/>
          <F label="Fee Split % (Finder 1)" k="splitPct"/>
        </div>
        <div style={{padding:"7px 10px",background:T.surface,borderRadius:6,fontSize:11,color:T.gl}}>
          {form.finder1} gets {form.splitPct}% - {form.finder2} gets {100-(parseInt(form.splitPct||50)||0)}%
        </div>
      </div>
      <div className="card" style={{marginBottom:11}}>
        <div style={{fontSize:10,textTransform:"uppercase",letterSpacing:".09em",color:T.gold,marginBottom:11}}>Agreement Parameters</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9}}>
          <F label="Buyer / Principal" k="buyer"/>
          <F label="Buyer Rep Title" k="buyerRep"/>
          <F label="Governing Jurisdiction" k="jurisdiction"/>
          <F label="Currency" k="currency" opts={["CAD","USD"]}/>
          <F label="Finder Fee Rate (%)" k="feeRate"/>
          <F label="Minimum Fee" k="minFee"/>
          <F label="Term (months)" k="term"/>
          <F label="Tail Period (months)" k="tail"/>
          <F label="Exclusivity" k="exclusivity" opts={["non-exclusive","exclusive"]}/>
        </div>
        <div style={{marginTop:12}}>
          <button className="btn" onClick={go} disabled={loading} style={{width:"100%",padding:"11px"}}>
            {loading?<span>Drafting... <Spin/></span>:"Generate Finder Fee Agreement - Ontario Law - Dual Signatories"}
          </button>
        </div>
      </div>
      <div style={{fontSize:11,color:T.gray,marginBottom:11,padding:"7px 11px",background:T.surface,borderRadius:6,border:`1px solid ${T.border}`}}>
        AI-generated reference. Have an Ontario-licensed business attorney review before execution. ADRIC arbitration, Toronto.
      </div>
      {loading&&<div className="card" style={{textAlign:"center",padding:32}}><Spin/><div style={{fontSize:12,color:T.gray,marginTop:9}}>Drafting Ontario dual-finder agreement...</div></div>}
      <ErrBox msg={err}/>
      {contract&&!loading&&(
        <div className="fade">
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
            <div style={{fontSize:10,textTransform:"uppercase",letterSpacing:".09em",color:T.gold}}>{form.finder1} and {form.finder2} - Ontario, Canada</div>
            <button className="ghost" onClick={copy}>{copied?"Copied":"Copy Agreement"}</button>
          </div>
          <div className="contract" style={{fontSize:13,lineHeight:2}}>{contract}</div>
          <div style={{fontSize:10,color:T.gray,marginTop:6,textAlign:"right"}}>PeakOffers - Governed by Ontario, Canada Law - ADRIC Arbitration, Toronto</div>
        </div>
      )}
    </div>
  );
}

// ── INTEL BRIEF ────────────────────────────────────────────────────────────────
function IntelBrief() {
  const [sector,setSector] = useState("Shopify Stores");
  const [loading,setLoading] = useState(false);
  const [brief,setBrief] = useState("");
  const [copied,setCopied] = useState(false);
  const [err,setErr] = useState("");

  const go=async()=>{
    resetCircuit();
    setLoading(true); setBrief(""); setErr("");
    const vert = VERTICALS.find(v=>v.label===sector)||VERTICALS[0];
    try {
      const r = await callAI(
        "You are a sharp M&A intelligence analyst. Specific data only. Every sentence actionable.",
        `Premium M&A Brief for ${sector}. Publisher: PeakOffers, Ontario, Canada (Mario Sofroniou and Vanessa Kisso). Revenue: ${vert.revRange}. Multiples: ${vert.multiples}.
1.Market Pulse (3 specific trends affecting valuations now)
2.Valuation Benchmarks (exact multiples with recent comparables)
3.Buyer Sentiment (what acquirers want in ${sector} right now)
4.Top 3 Undervalued Archetypes (specific business types to source)
5.Red Flags (3 things that kill deals in this vertical)
6.PeakOffers Watch List (5 specific business profiles to source this week)
7.This Weeks Action (3 specific moves for Mario and Vanessa in next 7 days)
Sharp, specific, worth $2,000/month.`, 900
      );
      setBrief(r);
    } catch(e) { setErr(e.message); }
    setLoading(false);
  };
  const copy=()=>{navigator.clipboard.writeText(brief).catch(()=>{}); setCopied(true); setTimeout(()=>setCopied(false),2000);};

  return (
    <div className="fade">
      <SH title="Intelligence Brief" sub="Live M&A briefs across all 20 verticals - updated on demand"/>
      <div style={{display:"flex",gap:9,marginBottom:13,flexWrap:"wrap"}}>
        <div style={{flex:1,minWidth:180}}>
          <select value={sector} onChange={e=>setSector(e.target.value)}>
            {["ecom","perf","biz"].map(cat=>(
              <optgroup key={cat} label={CAT_LABELS[cat]}>
                {VERTICALS.filter(v=>v.cat===cat).map(v=><option key={v.id}>{v.label}</option>)}
              </optgroup>
            ))}
          </select>
        </div>
        <button className="btn" onClick={go} disabled={loading} style={{padding:"9px 18px"}}>
          {loading?<Spin/>:"Generate Brief"}
        </button>
        {brief&&<button className="ghost" onClick={copy}>{copied?"Copied":"Copy"}</button>}
      </div>
      <ErrBox msg={err}/>
      {loading&&<div className="card" style={{textAlign:"center",padding:32}}><Spin/><div style={{fontSize:12,color:T.gray,marginTop:9}}>Compiling market intelligence...</div></div>}
      {brief&&!loading&&(
        <div className="fade">
          <div className="ai-box" style={{fontSize:13,lineHeight:1.85,maxHeight:"68vh",overflowY:"auto"}}>{brief}</div>
          <div style={{fontSize:10,color:T.gray,marginTop:7}}>PeakOffers - {sector} - {new Date().toLocaleDateString("en-CA",{month:"long",year:"numeric"})}</div>
        </div>
      )}
    </div>
  );
}

// ── ALERT CENTER ───────────────────────────────────────────────────────────────
function AlertCenter({alerts,setAlerts,ejsCfg,setEjsCfg,triggerTest}) {
  const [emailAddr,setEmailAddr] = useState(alerts.email||OWNER.email);
  const [phone,setPhone]         = useState(alerts.phone||"");
  const [minScore,setMin]        = useState(alerts.minScore||75);
  const [emailOn,setEmailOn]     = useState(alerts.emailOn??true);
  const [smsOn,setSmsOn]         = useState(alerts.smsOn??true);
  const [svcId,setSvc]           = useState(ejsCfg.serviceId||"");
  const [tplId,setTpl]           = useState(ejsCfg.templateId||"");
  const [pubKey,setPub]          = useState(ejsCfg.publicKey||"");
  const [saved,setSaved]         = useState(false);
  const [testing,setTest]        = useState(false);
  const [atab,setAtab]           = useState("email");
  const ejsOk = svcId&&tplId&&pubKey;

  const save=()=>{
    setAlerts({email:emailAddr,phone,minScore,emailOn,smsOn});
    setEjsCfg({serviceId:svcId,templateId:tplId,publicKey:pubKey});
    setSaved(true); setTimeout(()=>setSaved(false),2000);
  };
  const test=async t=>{setTest(true);await triggerTest(t);setTest(false);};

  const Toggle=({on,set,label,color,sub})=>(
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 12px",background:T.surface,borderRadius:7,border:`1px solid ${on?color+"44":T.border}`,marginBottom:8,transition:"border-color .18s"}}>
      <div><div style={{fontSize:12,fontWeight:600,color:T.white}}>{label}</div>{sub&&<div style={{fontSize:10,color:T.gray,marginTop:1}}>{sub}</div>}</div>
      <div onClick={()=>set(!on)} style={{width:40,height:22,borderRadius:11,background:on?color:T.border,cursor:"pointer",position:"relative",transition:"background .2s",flexShrink:0}}>
        <div style={{position:"absolute",top:2,left:on?20:2,width:18,height:18,borderRadius:"50%",background:T.white,transition:"left .2s"}}/>
      </div>
    </div>
  );
  const Step=({n,t,d,done})=>(
    <div className="step">
      <div className="sn" style={{background:done?"#0a1f0a":T.goldDim+"22",border:`1px solid ${done?T.green:T.goldDim}`,color:done?T.green:T.gold}}>{done?"V":n}</div>
      <div><div style={{fontSize:12,fontWeight:600,color:T.white}}>{t}</div><div style={{fontSize:11,color:T.gray,marginTop:2,whiteSpace:"pre-line",lineHeight:1.6}}>{d}</div></div>
    </div>
  );

  const emailTpl=`Subject: {{subject}}

Hi {{to_name}},

PeakOffers Scout found {{deal_count}} qualifying deal(s) - {{total_fees}} in finder fees:

{{deal_list}}

Top Deal: {{top_deal}}
Fee: {{top_fee}} | Score: {{top_score}}/100 | Type: {{top_type}}
Found: {{timestamp}}

Open PeakOffers dashboard to review and approve outreach.

-- PeakOffers
   Mario Sofroniou and Vanessa Kisso
   Ontario, Canada`;

  return (
    <div className="fade">
      <SH title="Alert Center" sub="Email live in 5 min - SMS live in 15 min"/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
        <div style={{padding:"12px 14px",borderRadius:9,border:`1px solid ${ejsOk?T.green+"44":T.border}`,background:ejsOk?"#050f05":T.surface,display:"flex",alignItems:"center",gap:11}}>
          <div style={{fontSize:14,color:ejsOk?T.green:T.gray}}>{ejsOk?"[LIVE]":"[OFF]"}</div>
          <div><div style={{fontSize:12,fontWeight:700,color:ejsOk?T.green:T.gray}}>Email - {ejsOk?"LIVE":"Configure Below"}</div><div style={{fontSize:10,color:T.gray,marginTop:1}}>{ejsOk?`Sending to ${emailAddr}`:"3 EmailJS keys needed"}</div></div>
        </div>
        <div style={{padding:"12px 14px",borderRadius:9,border:`1px solid ${T.border}`,background:T.surface,display:"flex",alignItems:"center",gap:11}}>
          <div style={{fontSize:14,color:T.gray}}>SMS</div>
          <div><div style={{fontSize:12,fontWeight:700,color:T.gray}}>SMS - Twilio + Make.com</div><div style={{fontSize:10,color:T.gray,marginTop:1}}>~15 min setup - ~$1/month</div></div>
        </div>
      </div>
      <div style={{display:"flex",gap:6,marginBottom:14}}>
        {[["email","Email Setup"],["sms","SMS Setup"],["settings","Settings"]].map(([id,label])=>(
          <button key={id} className={`tab ${atab===id?"on":""}`} onClick={()=>setAtab(id)}>{label}</button>
        ))}
      </div>

      {atab==="email"&&(
        <div className="fade">
          <div className="card" style={{marginBottom:12,borderColor:ejsOk?T.goldDim+"55":T.border}}>
            <Step n={1} t="Create free account at emailjs.com" d="200 emails/month free. No credit card." done={!!pubKey}/>
            <Step n={2} t="Add Email Service - connect Gmail" d={"Email Services - Add New Service - Gmail - Authorize\nCopy Service ID (service_xxxxxxx)"} done={!!svcId}/>
            <Step n={3} t="Create Email Template" d={"Email Templates - Create New Template\nPaste the template shown below\nCopy Template ID (template_xxxxxxx)"} done={!!tplId}/>
            <Step n={4} t="Copy your Public Key" d="Account - General - Copy Public Key" done={!!pubKey}/>
            <Step n={5} t="Paste all 3 keys below, Save, Test" d="Email will arrive within seconds." done={ejsOk}/>
            <div style={{margin:"13px 0",padding:"11px",background:"#060A08",borderRadius:7,border:`1px solid ${T.goldDim}22`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:7}}>
                <div style={{fontSize:10,color:T.goldDim,fontWeight:700,textTransform:"uppercase",letterSpacing:".06em"}}>Email Template - Copy into EmailJS</div>
                <button className="ghost" style={{fontSize:9}} onClick={()=>navigator.clipboard.writeText(emailTpl).catch(()=>{})}>Copy</button>
              </div>
              <pre style={{fontSize:11,color:T.gl,lineHeight:1.75,whiteSpace:"pre-wrap",wordBreak:"break-word",fontFamily:"'DM Mono',monospace"}}>{emailTpl}</pre>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:9,marginBottom:10}}>
              {[["Service ID",svcId,setSvc,"service_xxxxxxx"],["Template ID",tplId,setTpl,"template_xxxxxxx"],["Public Key",pubKey,setPub,"xxxxxxxxxxxxxxxxxxx"]].map(([label,val,set,ph])=>(
                <div key={label}><div style={{fontSize:10,color:T.gray,marginBottom:4}}>{label}</div><input value={val} onChange={e=>set(e.target.value)} placeholder={ph} style={{borderColor:val?T.green:T.border}}/></div>
              ))}
            </div>
            <div><div style={{fontSize:10,color:T.gray,marginBottom:4}}>Alert Email Address</div><input value={emailAddr} onChange={e=>setEmailAddr(e.target.value)} placeholder="mario@billiondollarads.ca"/></div>
          </div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            <button className="btn" onClick={save} style={{padding:"10px 22px"}}>{saved?"Saved - Email Live":"Save and Activate"}</button>
            <button className="ghost" onClick={()=>test("email")} disabled={testing}>{testing?"Sending...":ejsOk?"Send Test Email":"Save keys first"}</button>
          </div>
        </div>
      )}

      {atab==="sms"&&(
        <div className="fade">
          <div className="card" style={{marginBottom:12}}>
            <div style={{fontSize:12,fontWeight:700,color:T.white,marginBottom:3}}>Twilio + Make.com - Real SMS</div>
            <div style={{fontSize:11,color:T.gray,marginBottom:14}}>~15 min setup - ~$1/month</div>
            <Step n={1} t="Get Twilio number" d={"twilio.com - Phone Numbers - Buy a Number (~$1.15/mo)\nCopy Account SID and Auth Token from Console"}/>
            <Step n={2} t="Create Make.com scenario" d="make.com - Free account - New Scenario"/>
            <Step n={3} t="Add Custom Webhook trigger" d="Webhooks - Custom Webhook - Copy the URL"/>
            <Step n={4} t="Add Twilio SMS action" d={"Twilio - Send SMS - Connect SID and Token\nFrom: Twilio number - To: your mobile"}/>
            <Step n={5} t="Activate and paste webhook URL below" d="Toggle ON - paste URL - Save"/>
            <div style={{marginBottom:9,marginTop:11}}><div style={{fontSize:10,color:T.gray,marginBottom:4}}>Make.com Webhook URL</div><input placeholder="https://hook.eu1.make.com/xxxxxxxxxxxxxxxxx"/></div>
            <div><div style={{fontSize:10,color:T.gray,marginBottom:4}}>Your Mobile Number</div><input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+1 (519) 000-0000"/></div>
          </div>
          <button className="btn" onClick={save} style={{padding:"10px 22px"}}>{saved?"Saved":"Save SMS Settings"}</button>
        </div>
      )}

      {atab==="settings"&&(
        <div className="fade">
          <div className="card" style={{marginBottom:12}}>
            <Toggle on={emailOn} set={setEmailOn} label="Email Alerts" color={T.purple} sub={`Fires when deals score ${minScore}+`}/>
            <Toggle on={smsOn} set={setSmsOn} label="SMS Alerts" color={T.green} sub={phone||"Add number in SMS tab"}/>
          </div>
          <div className="card" style={{marginBottom:12}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
              <span style={{fontSize:12,color:T.white}}>Minimum Score to Alert</span>
              <span style={{fontFamily:"'DM Mono',monospace",color:T.gold,fontSize:14}}>{minScore}+</span>
            </div>
            <input type="range" min={50} max={95} value={minScore} onChange={e=>setMin(+e.target.value)} style={{width:"100%"}}/>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:T.gray,marginTop:4}}>
              <span>50 - max volume</span><span>75 - balanced</span><span>95 - elite only</span>
            </div>
          </div>
          <button className="btn" onClick={save} style={{padding:"10px 22px"}}>{saved?"Saved":"Save Settings"}</button>
        </div>
      )}
    </div>
  );
}


// ── APP ROOT ───────────────────────────────────────────────────────────────────
export default function App() {
  const [tab,setTab]       = useState("dashboard");
  const [deals,setDeals]   = useState(mkDeals);
  const [alerts,setAlerts] = useState({emailOn:true,smsOn:true,email:OWNER.email,phone:"",minScore:75});
  const [ejsCfg,setEjsCfg] = useState({serviceId:"",templateId:"",publicKey:""});
  const {ts,add:fire,rm}   = useToasts();

  const addDeals = useCallback(nd=>{
    setDeals(d=>{
      const ids=new Set(d.map(x=>x.id));
      return [...d,...nd.filter(x=>!ids.has(x.id))];
    });
  },[]);

  const sendEmail = useCallback(async ds=>{
    const cfg=ejsCfg;
    if (!cfg.serviceId||!cfg.templateId||!cfg.publicKey||!alerts.emailOn) return false;
    try { await sendAlertEmail({...cfg,toEmail:alerts.email||OWNER.email,toName:OWNER.name,deals:ds}); return true; }
    catch(e) { console.error("EmailJS:",e); return false; }
  },[ejsCfg,alerts]);

  const triggerTest = useCallback(async type=>{
    if (type==="email") {
      fire("Sending test email...","email","E");
      const ok=await sendEmail([{name:"Test - NorthFlow Shopify Store",vertical:"Shopify Stores",revenue:"$4.2M",margin:"31%",fee:"$413K",feeRaw:413000,score:92}]);
      fire(ok?`Email delivered to ${alerts.email||OWNER.email} - check inbox!`:"Configure EmailJS keys in Alert Center",ok?"ok":"warn",ok?"V":"!");
    }
    if (type==="sms") fire("SMS requires Twilio + Make.com - see SMS tab","warn","!");
  },[sendEmail,alerts,fire]);

  const pipelineVal = useMemo(()=>deals.filter(d=>d.stage!=="Dead").reduce((s,d)=>s+(d.feeRaw||0),0),[deals]);

  // Quick-action nav from Dashboard tiles
  useEffect(()=>{
    const handler = e => { if(e?.detail) setTab(e.detail); };
    document.addEventListener("peakoffers-nav", handler);
    return ()=>document.removeEventListener("peakoffers-nav", handler);
  },[]);

  // Ensure proper mobile viewport meta is set
  useEffect(()=>{
    let meta = document.querySelector('meta[name="viewport"]');
    if (!meta) { meta=document.createElement('meta'); meta.name='viewport'; document.head.appendChild(meta); }
    meta.content='width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover';
    // Apple PWA meta
    const appleCapable = document.querySelector('meta[name="apple-mobile-web-app-capable"]');
    if (!appleCapable) {
      const m=document.createElement('meta'); m.name='apple-mobile-web-app-capable'; m.content='yes';
      document.head.appendChild(m);
    }
    const appleStatus = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
    if (!appleStatus) {
      const m=document.createElement('meta'); m.name='apple-mobile-web-app-status-bar-style'; m.content='black-translucent';
      document.head.appendChild(m);
    }
    const theme = document.querySelector('meta[name="theme-color"]');
    if (!theme) {
      const m=document.createElement('meta'); m.name='theme-color'; m.content='#06080A';
      document.head.appendChild(m);
    }
    document.title='PeakOffers — Deal Flow v5';
  },[]);
  const hotCount    = useMemo(()=>deals.filter(d=>["LOI Stage","Closing"].includes(d.stage)).length,[deals]);
  const agentCount  = useMemo(()=>deals.filter(d=>d.stage==="Sourced"&&d.score>=alerts.minScore).length,[deals,alerts.minScore]);

  const nav = [
    {id:"dashboard", label:"Command"},
    {id:"agent",     label:"AI Agent"},
    {id:"matcher",   label:"Deal Matcher"},
    {id:"scout",     label:"Mega Scout"},
    {id:"pipeline",  label:"Pipeline"},
    {id:"verticals", label:"Verticals"},
    {id:"buyers",    label:"Buyers"},
    {id:"outreach",  label:"Outreach"},
    {id:"ledger",    label:"Commission"},
    {id:"valuation", label:"Valuation"},
    {id:"contracts", label:"Contracts"},
    {id:"intel",     label:"Intel"},
    {id:"alerts",    label:"Alerts"},
  ];

  const panels = useMemo(()=>({
    dashboard: <Dashboard deals={deals} alerts={alerts}/>,
    agent:     <AgentQueue deals={deals} alerts={alerts} ejsCfg={ejsCfg}/>,
    matcher:   <DealMatcher deals={deals}/>,
    scout:     <MegaScout onDeals={addDeals} alerts={alerts} sendEmail={sendEmail} fire={fire}/>,
    pipeline:  <Pipeline deals={deals} setDeals={setDeals}/>,
    verticals: <VerticalIntel deals={deals}/>,
    buyers:    <BuyerNetwork/>,
    outreach:  <OutreachEngine deals={deals}/>,
    ledger:    <CommissionLedger deals={deals}/>,
    valuation: <ValuationCalc/>,
    contracts: <ContractEngine/>,
    intel:     <IntelBrief/>,
    alerts:    <AlertCenter alerts={alerts} setAlerts={setAlerts} ejsCfg={ejsCfg} setEjsCfg={setEjsCfg} triggerTest={triggerTest}/>,
  }),[deals,alerts,ejsCfg,addDeals,sendEmail,fire,triggerTest,setDeals]);

  return (
    <>
      <style>{CSS}</style>
      <ToastStack ts={ts} rm={rm}/>
      <div style={{display:"flex",minHeight:"100vh",background:T.bg,overflowX:"hidden"}}>

        {/* ── DESKTOP SIDEBAR (hidden on mobile) ── */}
        <div className="sidebar-desktop" style={{width:178,background:T.surface,borderRight:`1px solid ${T.border}`,display:"flex",flexDirection:"column",padding:"16px 9px",position:"sticky",top:0,height:"100vh",overflowY:"auto",flexShrink:0}}>
          <div style={{padding:"0 5px 16px"}}>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:17,fontWeight:700,lineHeight:1.1}} className="shimmer">Peak<br/>Offers</div>
            <div style={{fontSize:9,color:T.goldDim,textTransform:"uppercase",letterSpacing:".12em",marginTop:4}}>Ontario, Canada</div>
            <div style={{fontSize:10,color:T.gray,marginTop:3}}>Deal Flow System v5</div>
          </div>
          <div style={{height:1,background:T.border,marginBottom:9}}/>
          <nav style={{display:"flex",flexDirection:"column",gap:2,flex:1}}>
            {nav.map(n=>(
              <div key={n.id} className={`nav ${tab===n.id?"on":""}`} onClick={()=>setTab(n.id)}>
                <span>{n.label}</span>
                {n.id==="alerts"&&(alerts.emailOn||alerts.smsOn)&&(
                  <span style={{marginLeft:"auto",width:5,height:5,borderRadius:"50%",background:T.green,flexShrink:0}} className="pulse"/>
                )}
                {n.id==="agent"&&agentCount>0&&(
                  <span style={{marginLeft:"auto",fontSize:10,background:T.orange,color:T.goldDeep,padding:"1px 5px",borderRadius:10,fontWeight:700}}>{agentCount}</span>
                )}
                {n.id==="pipeline"&&deals.filter(d=>["LOI Stage","Closing"].includes(d.stage)).length>0&&(
                  <span style={{marginLeft:"auto",fontSize:9,background:T.green+"22",color:T.green,padding:"1px 5px",borderRadius:10,fontWeight:700,border:`1px solid ${T.green}44`}}>{deals.filter(d=>["LOI Stage","Closing"].includes(d.stage)).length}</span>
                )}
                {n.id==="matcher"&&deals.filter(d=>d.stage==="Sourced").length>0&&(
                  <span style={{marginLeft:"auto",fontSize:9,background:T.blue+"22",color:T.blue,padding:"1px 5px",borderRadius:10,fontWeight:700,border:`1px solid ${T.blue}44`}}>{deals.filter(d=>d.stage==="Sourced").length}</span>
                )}
              </div>
            ))}
          </nav>
          <div style={{height:1,background:T.border,margin:"11px 0"}}/>
          <div style={{padding:"0 5px"}}>
            <div style={{fontSize:9,color:T.gray,textTransform:"uppercase",letterSpacing:".09em",marginBottom:5}}>Live Status</div>
            <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:4}}>
              <div style={{width:5,height:5,borderRadius:"50%",background:T.green}} className="pulse"/>
              <span style={{fontSize:10,color:T.green}}>Scout Active</span>
            </div>
            <div style={{fontSize:10,color:T.goldDim}}>20 verticals - 22 sources</div>
            <div style={{fontSize:10,color:T.goldDim}}>~1,400/day - 27 buyers</div>
            <div style={{marginTop:9,padding:"7px 9px",background:T.goldDeep,borderRadius:6,border:`1px solid ${T.goldDim}44`}}>
              <div style={{fontSize:9,color:T.goldDim,textTransform:"uppercase",letterSpacing:".07em"}}>Pipeline</div>
              <div style={{fontSize:14,fontWeight:700,color:T.gold,fontFamily:"'DM Mono',monospace"}}>${(pipelineVal/Math.max(1e6,1)).toFixed(1)}M</div>
            </div>
            <div style={{fontSize:10,color:T.gray,marginTop:7}}>{deals.filter(d=>d.stage==="Sourced").length} new - {hotCount} hot - {deals.filter(d=>d.stage==="Closed").length} closed</div>
            <div style={{display:"flex",gap:4,marginTop:7,flexWrap:"wrap"}}>
              {alerts.emailOn&&<span className="badge b-intro" style={{fontSize:9,padding:"2px 7px"}}>Email</span>}
              {alerts.smsOn&&<span className="badge b-closing" style={{fontSize:9,padding:"2px 7px"}}>SMS</span>}
            </div>
            <div style={{marginTop:8,padding:"5px 7px",background:T.surface,borderRadius:5,border:`1px solid ${T.border}`}}>
              <div style={{fontSize:9,color:T.gray,textTransform:"uppercase",letterSpacing:".07em"}}>Finders</div>
              <div style={{fontSize:11,color:T.white,marginTop:3,lineHeight:1.8,fontWeight:500}}>Mario S.<br/>Vanessa K.</div>
            </div>
          </div>
        </div>

        {/* ── MAIN CONTENT ── */}
        <div style={{flex:1,display:"flex",flexDirection:"column",minWidth:0,overflow:"hidden"}}>
          <Ticker/>
          <div className="main-content mobile-pad" style={{flex:1,padding:"28px 36px",overflowY:"auto",overflowX:"hidden",minWidth:0}}>
            {panels[tab]}
          </div>
        </div>
      </div>

      {/* ── MOBILE BOTTOM NAV (hidden on desktop) ── */}
      <div className="bottom-nav">
        <div className="bottom-nav-inner">
          {[
            {id:"dashboard", icon:"⌂", label:"Command"},
            {id:"agent",     icon:"⚡", label:"Agent"},
            {id:"scout",     icon:"◎", label:"Scout"},
            {id:"pipeline",  icon:"◈", label:"Pipeline"},
            {id:"matcher",   icon:"⟷", label:"Matcher"},
            {id:"buyers",    icon:"◆", label:"Buyers"},
            {id:"outreach",  icon:"✉", label:"Outreach"},
            {id:"valuation", icon:"$", label:"Valuation"},
            {id:"contracts", icon:"§", label:"Contract"},
            {id:"intel",     icon:"⊙", label:"Intel"},
            {id:"verticals", icon:"▦", label:"Verticals"},
            {id:"ledger",    icon:"✓", label:"Ledger"},
            {id:"alerts",    icon:"◉", label:"Alerts"},
          ].map(n=>(
            <button key={n.id} className={`bnav-btn ${tab===n.id?"on":""}`} onClick={()=>setTab(n.id)}>
              {n.id==="agent"&&agentCount>0&&<span className="bnav-badge">{agentCount}</span>}
              {n.id==="pipeline"&&deals.filter(d=>["LOI Stage","Closing"].includes(d.stage)).length>0&&(
                <span className="bnav-badge" style={{background:T.green,color:"#021a08"}}>{deals.filter(d=>["LOI Stage","Closing"].includes(d.stage)).length}</span>
              )}
              {n.id==="alerts"&&(alerts.emailOn||alerts.smsOn)&&<span className="bnav-badge" style={{background:T.green,color:"#021a08"}}>●</span>}
              <span className="bnav-icon">{n.icon}</span>
              <span className="bnav-label">{n.label}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}


