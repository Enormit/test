/**
 * Decrypts encrypted actions from hoathinh3d HTML source code.
 * Replicated from the tampermonkey and chrome extension logic.
 */

function decryptHh3dActions(html) {
    if (!html) return null;
    
    // Pattern: var k="...",d="..."; or similar formats
    const matchK = html.match(/[,\s]k\s*=\s*["'](\d+)["']/);
    const matchD = html.match(/[,\s]d\s*=\s*["']([A-Za-z0-9+/=]{100,})["']/);
    
    if (!matchK || !matchD) {
        // Alternative pattern matching
        const altMatch = html.match(/var\s+k\s*=\s*"([^"]+)"\s*,\s*d\s*=\s*"([^"]+)"/);
        if (altMatch) {
            return performXorDecrypt(altMatch[1], altMatch[2]);
        }
        return null;
    }

    return performXorDecrypt(matchK[1], matchD[1]);
}

function performXorDecrypt(k, d) {
    try {
        // Base64 decode to binary string in Node.js
        const b = Buffer.from(d, 'base64').toString('binary');
        let r = "";
        for (let i = 0; i < b.length; i++) {
            r += String.fromCharCode(b.charCodeAt(i) ^ k.charCodeAt(i % k.length));
        }
        return JSON.parse(r);
    } catch (e) {
        console.error("Failed to decrypt hh3d actions:", e);
        return null;
    }
}

/**
 * Extracts specific values like securityToken, restNonce, and userId from HTML
 */
function extractFromHtml(html, pattern) {
    if (!html) return null;
    const match = html.match(pattern);
    return match?.[1] ? decodeURIComponent(match[1]) : null;
}

module.exports = {
    decryptHh3dActions,
    extractFromHtml
};
