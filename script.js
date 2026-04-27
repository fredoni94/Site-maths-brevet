let selectedTime = 60;
let selectedMode = "add";
let timeLeft = 60;
let startTime = 60;
let timerInterval = null;
let currentAnswer = 0;
let good = 0;
let bad = 0;
let locked = false;

const home = document.getElementById("home");
const mathMenu = document.getElementById("mathMenu");
const game = document.getElementById("game");
const result = document.getElementById("result");
const signup = document.getElementById("signup");

const mathBtn = document.getElementById("mathBtn");
const goMathBtn = document.getElementById("goMathBtn");
const startHomeBtn = document.getElementById("startHomeBtn");
const scrollSignupBtn = document.getElementById("scrollSignupBtn");

const startBtn = document.getElementById("startBtn");
const validateBtn = document.getElementById("validateBtn");
const restartBtn = document.getElementById("restartBtn");
const homeBtn = document.getElementById("homeBtn");

const answerInput = document.getElementById("answer");

function showSection(section) {
  mathMenu.classList.add("hidden");
  game.classList.add("hidden");
  result.classList.add("hidden");

  if (section === "math") {
    mathMenu.classList.remove("hidden");
    mathMenu.scrollIntoView({ behavior: "smooth" });
  }

  if (section === "game") {
    game.classList.remove("hidden");
    game.scrollIntoView({ behavior: "smooth" });
  }

  if (section === "result") {
    result.classList.remove("hidden");
    result.scrollIntoView({ behavior: "smooth" });
  }
}

function openMathMenu() {
  showSection("math");
}

mathBtn.addEventListener("click", openMathMenu);
goMathBtn.addEventListener("click", openMathMenu);
startHomeBtn.addEventListener("click", openMathMenu);

scrollSignupBtn.addEventListener("click", () => {
  signup.scrollIntoView({ behavior: "smooth" });
});

homeBtn.addEventListener("click", () => {
  result.classList.add("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
});

restartBtn.addEventListener("click", () => {
  showSection("math");
});

document.querySelectorAll(".time").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".time").forEach((b) => b.classList.remove("selected"));
    btn.classList.add("selected");
    selectedTime = Number(btn.dataset.time);
  });
});

document.querySelectorAll(".mode").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".mode").forEach((b) => b.classList.remove("selected"));
    btn.classList.add("selected");
    selectedMode = btn.dataset.mode;
  });
});

startBtn.addEventListener("click", startGame);
validateBtn.addEventListener("click", checkAnswer);

answerInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    checkAnswer();
  }
});

function startGame() {
  good = 0;
  bad = 0;
  timeLeft = selectedTime;
  startTime = selectedTime;
  locked = false;

  document.getElementById("good").textContent = good;
  document.getElementById("bad").textContent = bad;
  document.getElementById("timer").textContent = timeLeft;
  document.getElementById("progressBar").style.width = "100%";

  showSection("game");
  generateQuestion();

  clearInterval(timerInterval);

  timerInterval = setInterval(() => {
    timeLeft--;

    document.getElementById("timer").textContent = timeLeft;
    document.getElementById("progressBar").style.width = `${(timeLeft / startTime) * 100}%`;

    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateQuestion() {
  locked = false;

  answerInput.value = "";

  const feedback = document.getElementById("feedback");
  feedback.textContent = "";
  feedback.className = "feedback";

  let mode = selectedMode;

  if (selectedMode === "mix") {
    const modes = ["add", "sub", "mul"];
    mode = modes[rand(0, modes.length - 1)];
  }

  let a = rand(1, 12);
  let b = rand(1, 12);
  let text = "";

  if (mode === "add") {
    currentAnswer = a + b;
    text = `${a} + ${b} = ?`;
  }

  if (mode === "sub") {
    a = rand(10, 35);
    b = rand(1, 20);
    currentAnswer = a - b;
    text = `${a} − ${b} = ?`;
  }

  if (mode === "mul") {
    currentAnswer = a * b;
    text = `${a} × ${b} = ?`;
  }

  if (mode === "enigme") {
    const n = rand(2, 12);
    const r = n * 2 + 4;
    currentAnswer = n;
    text = `Je pense à un nombre. Je le multiplie par 2 puis j’ajoute 4. J’obtiens ${r}. Quel est ce nombre ?`;
  }

  document.getElementById("question").textContent = text;

  setTimeout(() => {
    answerInput.focus();
  }, 100);
}

function checkAnswer() {
  if (locked) return;

  const value = answerInput.value.trim();
  const feedback = document.getElementById("feedback");

  if (value === "") {
    feedback.textContent = "Entre une réponse.";
    feedback.className = "feedback ko";
    return;
  }

  locked = true;

  const userAnswer = Number(value);

  if (userAnswer === currentAnswer) {
    good++;
    feedback.textContent = "✅ Bien joué !";
    feedback.className = "feedback ok";
  } else {
    bad++;
    feedback.textContent = `❌ La bonne réponse était ${currentAnswer}`;
    feedback.className = "feedback ko";
  }

  document.getElementById("good").textContent = good;
  document.getElementById("bad").textContent = bad;

  setTimeout(() => {
    if (timeLeft > 0) {
      generateQuestion();
    }
  }, 750);
}

function endGame() {
  clearInterval(timerInterval);

  showSection("result");

  const total = good + bad;
  const percent = total === 0 ? 0 : Math.round((good / total) * 100);

  document.getElementById("finalPercent").textContent = `${percent}%`;
  document.getElementById("finalText").innerHTML =
    `<strong>${good}</strong> bonnes réponses sur <strong>${total}</strong> questions.`;

  let msg = "";

  if (percent >= 85) {
    msg = "🔥 Excellent niveau. Tu es clairement sur une dynamique Brevet Ready.";
  } else if (percent >= 65) {
    msg = "👍 Bon travail. Continue régulièrement pour gagner en vitesse et en précision.";
  } else {
    msg = "💪 Il faut consolider les bases. Recommence en session courte, puis augmente progressivement.";
  }

  document.getElementById("coachMessage").textContent = msg;
}
