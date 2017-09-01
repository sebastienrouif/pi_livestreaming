var FB = require('fb'),
    fb = new FB.Facebook();

FB.setAccessToken('EAACEdEose0cBALwXnESFStSPIrNhZAJL04s19rQiDZCUmveMv80Ah5nQONxzqk9tSu6ZBtSgK2tyEmk3f0ZBPsk7L9bn7JGNsV6GMqxnMywt6z5PTwn96SRH4EFJvEiPqgby2pk0LhDDvl5UZCxlwpeb1i1fpYmNZBrHffZBmZCHyise3g1xixZA757P9rxC8ZCiewZBRmA9GTSi6CPBqJVgIznpJJLIJZCkUDcZD');

var fs = require('fs');


var event_wedding_id : 1219917591379215,
    album_wedding_id : 123,
    group_wedding_id : 456;




var body = 'hello world';
FB.api('1219917591379215/feed', 'post', { message: body }, function (res) {
  if(!res || res.error) {
    console.log(!res ? 'error occurred' : res.error);
    return;
  }
  console.log('Post Id: ' + res.id);
});



//
// FB.api('333116043778666/photos', 'post', { source: fs.createReadStream('pics/IMG_20170831_121718_020.jpg'), caption: 'It\'s happening =)' }, function (res) {
//   if(!res || res.error) {
//     console.log(!res ? 'error occurred' : res.error);
//     return;
//   }
//   console.log('Post Id: ' + res.post_id);
// });

// FB.api('me/photos', 'post', { source: { value: photoBuffer, options: { contentType: 'image/jpeg' } }, caption: 'It\'s happening =)' }, function (res) {
//   if(!res || res.error) {
//     console.log(!res ? 'error occurred' : res.error);
//     return;
//   }
//   console.log('Post Id: ' + res.post_id);
// });


// IDs
