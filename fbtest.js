var FB = require('fb'),
    fb = new FB.Facebook();

FB.setAccessToken('EAACEdEose0cBAJPZB5r6XkZASsolqZBpNUUKuLEXjQpR6i5eISoi4SkhzPTZAqHC8OnIL7k8yiw9RJtXCcVdoNTeWPelpnud7P4LB75ZCxS8Y9kA8WqIZAuyNjbg6OOQNpEmolo5X2ecWEVmkbx50rvdS6TJMW1E7BxJroivzoWDUiI4bVvGnZCNVDZCVpzv6nU67WjZBq6MYAAZDZD');

var fs = require('fs');


var event_wedding_id = 1219917591379215,
    album_wedding_id = 114810819202282,
    group_wedding_id = 114809552535742;




// var body = 'hello world';
// FB.api('1219917591379215/feed', 'post', { message: body }, function (res) {
//   if(!res || res.error) {
//     console.log(!res ? 'error occurred' : res.error);
//     return;
//   }
//   console.log('Post Id: ' + res.id);
// });




FB.api(album_wedding_id+'/photos', 'post', { source: fs.createReadStream('pics/IMG_20170831_121718_020.jpg'), caption: 'It\'s happening =)' }, function (res) {
  if(!res || res.error) {
    console.log(!res ? 'error occurred' : res.error);
    return;
  }
  console.log('Post Id: ' + res.post_id);
});

// FB.api('me/photos', 'post', { source: { value: photoBuffer, options: { contentType: 'image/jpeg' } }, caption: 'It\'s happening =)' }, function (res) {
//   if(!res || res.error) {
//     console.log(!res ? 'error occurred' : res.error);
//     return;
//   }
//   console.log('Post Id: ' + res.post_id);
// });


// IDs
