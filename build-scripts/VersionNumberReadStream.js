const
    util = require('util'),
    stream = require('stream'),
    Readable = stream.Readable,
    packageJson = require('../package');

function VersionNumberReadStream (options) {
    Readable.call(this, Object.assign({
        encoding: 'utf8',
        objectMode: false,
    }, options));
}

util.inherits(VersionNumberReadStream, Readable);

VersionNumberReadStream.prototype._read = function () {
`/**
 * Content generated by '{project-root}/build-scripts/VersionNumberReadStream.js'.
 * Generated ${new Date()} 
 */
 
export const version = '${packageJson.version}';

export default version;
`
    .split('').forEach(this.push, this);
    this.push('\n');
    this.push(null);
};

module.exports = VersionNumberReadStream;