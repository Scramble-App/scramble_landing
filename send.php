<?php

  $json = array();

  //Make sure that it is a POST request.
  if(strcasecmp($_SERVER['REQUEST_METHOD'], 'POST') != 0) {
    echo 'GET LOST, ROBOT!';
    die;
    // throw new Exception('Request method must be POST!');
  }

  //Make sure that the content type of the POST request has been set to application/json
  $contentType = isset($_SERVER["CONTENT_TYPE"]) ? trim($_SERVER["CONTENT_TYPE"]) : '';
  if(strpos($contentType, 'application/json') != 0) {
    $json['error'] = "Content type must be: 'application/json', not '$contentType'";
    echo json_encode($json);
    die;
    // throw new Exception("Content type must be: application/json but not $contentType");
  }

  //Receive the RAW post data.
  $content = trim(file_get_contents("php://input"));

  //Attempt to decode the incoming RAW post data from JSON.
  $data = json_decode($content, true);

  if ($data == NULL ) {
    $json['error'] = "Empty request";
    echo json_encode($json);
    die;
  }

  //If json_decode failed, the JSON is invalid.
  if(!is_array($data)){
    $json['error'] = "Received content contained invalid JSON!\n$content";
    echo json_encode($json);
    die;
    // throw new Exception('Received content contained invalid JSON!');
  }
  if ( htmlspecialchars($data['_gotcha']) ) {
    echo 'GET LOST, ROBOT!';
    die;
  }

  $fblink = htmlspecialchars($data['fb-link']);
  $lilink = htmlspecialchars($data['li-link']);

  if (!$fblink && !$lilink) {
    $json['error'] = "Neither facebook nor google link were received!";
    echo json_encode($json);
    die;
  }
  function mime_header_encode($str, $data_charset, $send_charset) { 
    if($data_charset != $send_charset)
    $str = iconv($data_charset,$send_charset.'//IGNORE',$str);
    return ('=?'.$send_charset.'?B?'.base64_encode($str).'?=');
  }
  
  class TEmail {
    // public $from_email;
    // public $from_name;
    public $to_email;
    public $to_name;
    // public $bcc_name;
    // public $bcc_email;
    public $subject;
    public $data_charset='UTF-8';
    public $send_charset='UTF-8';
    public $body='';
    public $type='text/html';

    function send(){
      $dc = $this->data_charset;
      $sc = $this->send_charset;
      $enc_to = mime_header_encode($this->to_name,$dc,$sc).' <'.$this->to_email.'>';
      $enc_subject = mime_header_encode($this->subject,$dc,$sc);
      $enc_bcc = mime_header_encode($this->bcc_name,$dc,$sc).' <'.$this->bcc_email.'>';
      // $enc_from = mime_header_encode($this->from_name,$dc,$sc).' <'.$this->from_email.'>';
      $enc_body = $dc==$sc ? $this->body : iconv($dc,$sc.'//IGNORE',$this->body);
      $headers = '';
      $headers .= "Mime-Version: 1.0\r\n";
      $headers .= "Content-type: ".$this->type."; charset=".$sc."\r\n";
      // $headers .= "From: ".$enc_from."\r\n";
      $headers .=  "Bcc: ".$enc_bcc."\r\n";
      return mail($enc_to,$enc_subject,$enc_body,$headers);
    }

  }

  $emailgo = new TEmail;
  // $emailgo->from_email = 'irina@scrambleup.com';
  // $emailgo->from_name  = 'scramble';
  $emailgo->bcc_email = 'me@yankie.ru';
  $emailgo->to_email = 'irina@scrambleup.com';
  $emailgo->to_name  = 'scramble';
  $emailgo->subject = 'Lead from scramble';
  $emailgo->body = '
  <html>
    <head>
    <title>'.$emailgo->subject.'</title>
    </head>
    <body>
      <p>Message recieved from \'scramble\'</p>
      <hr>
      <p>Facebook: '.$fblink.'</p>
      <p>LinkedIn: '.$lilink.'</p>
    </body>
  </html>';

  $emailgo->send();

  $json['error'] = 0;
  $json['result'] = "Mail sent";

  echo json_encode($json);
?>
