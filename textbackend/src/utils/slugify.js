const slugify = require('slugify');

function makeSlug(str) {
  return slugify(str || '', { lower: true, strict: true, trim: true }).slice(0, 200);
}

module.exports = { makeSlug };
