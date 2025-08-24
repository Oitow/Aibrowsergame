let gold = 0;

function mine() {
  gold += 1;
  document.getElementById("gold").innerText = `Gold: ${gold}`;
}