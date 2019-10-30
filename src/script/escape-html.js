const map = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#039;',
};

const mapRe = new RegExp(`[${Object.keys(map).join('')}]`, 'g');
const safeStrs = new WeakSet();

function escape(text) {
  return text.replace(mapRe, m => map[m]);
}

module.exports.escape = escape;

function safe(str) {
  const strObj = new String(str);
  safeStrs.add(strObj);
  return strObj;
}

module.exports.safe = safe;

function html(parts, ...subs) {
  return safe(
    parts.reduce((result, part, i) => {
      let sub = subs[i - 1];

      // Normalise to array to handle mapping through arrays
      if (!Array.isArray(sub)) {
        sub = [sub];
      }

      const processedSub = sub
        .map(s => (safeStrs.has(s) ? s.toString() : escape(s.toString())))
        .join('');

      return result + processedSub + part;
    }),
  );
}

module.exports.html = html;
