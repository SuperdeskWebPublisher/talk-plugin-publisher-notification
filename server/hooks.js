const fetch = require('node-fetch');
const AssetModel = require('../../../models/asset');

module.exports = {
  RootMutation: {
    createComment: {
      async post(root, args, context, info, result) {
        let asset = await AssetModel.findOne({id: result.comment.asset_id});
        let commentCount = await CommentModel.count({asset_id: result.comment.asset_id});

        process.nextTick(async () => {
          const response = await fetch(process.env.TALK_PUBLISHER_API_URL + 'content/articles', {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'x-superdesk-signature': 'sha1=' + process.env.TALK_PUBLISHER_AUTH_TOKEN
            },
            body: JSON.stringify({
              article: {
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
        return result;
      },
    },
  },
};
