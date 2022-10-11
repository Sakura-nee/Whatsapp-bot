'use-strict';
const fs = require('fs');

function isfile(path) {
    try {
        const stat = fs.lstatSync(path);
        return stat.isFile();
    } catch (e) {
        return false;
    }
}

async function load_cog(cog, container) {
    let resp = new Object()
    try {
        if(container.hasOwnProperty(cog)) {
            return `module named *${cog}* already actived!`
        } else {
            if(isfile(`./cog/${cog}.js`)) {
                container[cog] = require(`../cog/${cog}`);
                return `module *${cog}* actived!`
            } else {
                return `no such module named *${cog}*`;
            }
        }
    } catch (err) {
        return `cant load *${cog}* - ${err.stack}`;
    }
}

async function reload_cog(cog, container) {
    if(container.hasOwnProperty(cog)) {
        delete require.cache[require.resolve(`../cog/${cog}.js`)];
        delete container[cog];
        if(isfile(`./cog/${cog}.js`)) {
            container[cog] = require(`../cog/${cog}`);
            return `module *${cog}* actived!`
        } else {
            return `no such module named *${cog}*`;
        }
    } else {
        return `cannot find module *${cog}*`
    }
}

async function unload_cog(cog, container) {
    try {
        if(container.hasOwnProperty(cog)) {
            delete require.cache[require.resolve(`../cog/${cog}.js`)];
            delete container[cog];
            return `module *${cog}* deactived!`;
        } else {
            return `cannot find module *${cog}*`
        }
    } catch (err) {
        return `cant load *${cog}* - ${err.stack}`;
    }
}

module.exports = {
    unload_cog: unload_cog,
    load_cog: load_cog,
    reload_cog: reload_cog,
}