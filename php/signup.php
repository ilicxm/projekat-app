<?php
// Allow from any origin
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');    // cache for 1 day
}

// Access-Control headers are received during OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

    exit(0);
}

// Ostatak vašeg PHP koda...


// Povezivanje s bazom podataka
$mysqli = new mysqli("localhost", "korisnik", "lozinka", "projekatmobilno");

// Provjera konekcije
if ($mysqli->connect_error) {
    die("Connection failed: " . $mysqli->connect_error);
}

// Prihvaćanje podataka iz POST zahtjeva
$name = $_POST['name'];
$email = $_POST['email'];
$password = $_POST['password'];

// Izvršavanje upita za unos korisnika u bazu podataka
$query = "INSERT INTO user (name, email, password) VALUES ('$name', '$email', '$password')";
$result = $mysqli->query($query);

// Provjera rezultata upita
if ($result === TRUE) {
    echo json_encode(['success' => true, 'message' => 'User registered successfully']);
} else {
    echo json_encode(['success' => false, 'message' => 'Error registering user']);
}

// Zatvaranje konekcije s bazom podataka
$mysqli->close();
?>
