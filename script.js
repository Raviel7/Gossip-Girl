async function buscarFofocaDoReddit() {
  const subreddits = ['confession', 'TrueOffMyChest', 'gossip'];
  const subreddit = subreddits[Math.floor(Math.random() * subreddits.length)];
  const url = `https://www.reddit.com/r/${subreddit}/hot.json?limit=50`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    const posts = data.data.children;

    const titulos = posts.map(post => post.data.title).filter(t => t.length > 20);
    const escolhido = titulos[Math.floor(Math.random() * titulos.length)];
    return escolhido;
  } catch (err) {
    return "Não conseguimos fofocar agora. Tente novamente.";
  }
}

async function enviarFofoca() {
  const input = document.getElementById("fofocaInput");
  const texto = input.value.trim();

  if (texto.length === 0) {
    alert("Escreva uma fofoca antes de enviar!");
    return;
  }

  const fofocas = JSON.parse(localStorage.getItem("fofocas") || "[]");
  fofocas.push(texto);
  localStorage.setItem("fofocas", JSON.stringify(fofocas));

  let resposta = "☕ " + texto;

  if (fofocas.length > 1) {
    let aleatoria;
    do {
      aleatoria = fofocas[Math.floor(Math.random() * fofocas.length)];
    } while (aleatoria === texto);
    resposta = "☕ " + aleatoria;
  } else {
    resposta = "☕ " + await buscarFofocaDoReddit();
  }

  document.getElementById("resposta").innerText = resposta;
  input.value = "";
}