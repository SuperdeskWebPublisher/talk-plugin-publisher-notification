const fetch = require('node-fetch');
const AssetModel = require('../../../models/asset');
const CommentsLoader = require('../../../graph/loaders/comments.js');

const sendData = (asset, commentCount) => {
  process.nextTick(async () => {
    const response = await fetch(process.env.TALK_PUBLISHER_API_URL + 'content/articles', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-superdesk-signature': 'sha1=' + process.env.TALK_PUBLISHER_AUTH_TOKEN
      },
      body: JSON.stringify({
        article_comments: {
          url: asset.url,
          commentsCount: commentCount
        }
      }),
    });
    if (!response.ok) {
      const responseText = await response.text();
      console.trace(
        `Posting comment count to Publisher failed with HTTP code ${
          response.status
        } and body '${responseText}'`
      );
    }
  });
};

module.exports = {
  RootMutation: {
    createComment: {
      async post(root, args, context, info, result) {
        const asset = await AssetModel.findOne({
          id: result.comment.asset_id
        });
        const commentCount = await CommentsLoader().Comments.countByAssetID.load(result.comment.asset_id);

        sendData(asset, commentCount);
        return result;
      },
    },
    setCommentStatus: {
      async post(root, args, ctx) {
        const comment = await ctx.loaders.Comments.get.load(args.id);
        if (comment) {
          const asset = await ctx.loaders.Assets.getByID.load(
            comment.asset_id
          );
          const commentCount = await CommentsLoader().Comments.countByAssetID.load(comment.asset_id);

          sendData(asset, commentCount);
        }
      }
    },
  },
};
