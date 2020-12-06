<?php
// INIT
require __DIR__ . DIRECTORY_SEPARATOR . "lib" . DIRECTORY_SEPARATOR . "2a-config.php";

// MASQUERADE AS JOHN DOE
// Well, your users will normally log in and don't need this part
$_SESSION['user'] = [
  "id" => 1,
  "name" => "John Doe",
  "email" => "john@doe.com"
];

// THE DUMMY FRIENDS HTML PAGE ?>
<!DOCTYPE html>
<html>
  <head>
    <title>
      PHP Friends System Demo
    </title>
    <script src="public/3b-friends.js"></script>
    <link href="public/3c-friends.css" rel="stylesheet">
  </head>
  <body>
    <h1>USER LIST</h1>
    <div id="user-list"></div>
  </body>
</html>