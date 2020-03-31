function setValue( $value ) {
    var $elementReference = document.getElementById( "shift" );
    $elementReference.value = $value;
    var $value = $elementReference.value;
    document.getElementById( "shiftOutput" ).innerHTML = $value;
}
function getValue() {
    var $elementReference = document.getElementById( "shift" );
    var $value = $elementReference.value;
    document.getElementById( "shiftOutput" ).innerHTML = $value;
}