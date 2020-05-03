const shortid = require('shortid');
const cookie = require('cookie');

export const PLAYER_UUID_COOKIE_NAME = "plar_uuid";
// Player UUIDs expire after 48 hours
export const PLAYER_UUID_EXPIRY = 48 * 60 * 60 * 1000;

export function playerIdFromRequest(req) {
    return req.cookies[PLAYER_UUID_COOKIE_NAME];
}

export function newPlayerId() {
    return shortid.generate();
}

export function setPlayerIdCookie(pid, req, res) {
    res.setHeader('Set-Cookie', cookie.serialize(PLAYER_UUID_COOKIE_NAME, pid, {
        // Make the player ID unique to this table by using the table's path
        path: `${req.baseUrl}/${req.params.id}`,
        // TODO: should httpOnly be true?
        // httpOnly: true,
        maxAge: PLAYER_UUID_EXPIRY,
    }));
}

export function TwoWayMap() {
    // maps player ID (from cookie) -> socket ID (from socket.io session)
    this.kv = new Map();
    // maps socket ID -> player ID
    this.vk = new Map();
}

TwoWayMap.prototype.set = function(k, v) {
    this.kv.set(k, v);
    this.vk.set(v, k);
};

TwoWayMap.prototype.key = function(k) {
    return this.kv.get(k)
};

TwoWayMap.prototype.val = function(v) {
    return this.vk.get(v)
};

TwoWayMap.prototype.clear = function() {
    this.kv.clear();
    this.vk.clear()
};

TwoWayMap.prototype.deleteKey = function(k) {
    this.vk.delete(this.kv.get(k));
    this.kv.delete(k);
};

TwoWayMap.prototype.hasKey = function(k) {
    return this.kv.has(k)
};

TwoWayMap.prototype.hasValue = function(v) {
    return this.vk.has(v)
};

TwoWayMap.prototype.getKv = function() {
    return this.kv
};

TwoWayMap.prototype.getVk = function() {
    return this.vk
};