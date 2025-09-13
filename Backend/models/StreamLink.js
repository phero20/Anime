import mongoose from 'mongoose';

const StreamLinkSchema = new mongoose.Schema({
    episodeId: {
        type: String,
    },
    server: {
        type: String,
    },
    category: {
        type: String,
        enum: ['sub', 'dub']
    },
    headers: {
        Referer: {
            type: String,

        }
    },
    tracks: [{
        url: {
            type: String,
            required: true
        },
        lang: {
            type: String,
            required: true
        }
    }],
    intro: {
        start: {
            type: Number,
            default: 0
        },
        end: {
            type: Number,
            default: 0
        }
    },
    outro: {
        start: {
            type: Number,
            default: 0
        },
        end: {
            type: Number,
            default: 0
        }
    },
    sources: [{
        url: {
            type: String,
            required: true
        },
        isM3U8: {
            type: Boolean,
            default: true
        },
        type: {
            type: String,
            default: 'hls'
        }
    }],
    anilistID: {
        type: Number,
    },
    malID: {
        type: Number,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
}, {
    timestamps: true
});

// Compound unique index to allow same episodeId with different server/category combinations
StreamLinkSchema.index({ episodeId: 1, server: 1, category: 1 }, { unique: true });

const StreamLink = mongoose.model('StreamLink', StreamLinkSchema);

export default StreamLink;
