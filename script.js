var values = [
   "wwwwwwwwwb",
   "wbwbbbbbwb",
   "wwwwwbwbwb",
   "wbwbwwwwww",
   "wbwbwbwbbb",
   "wwwwwbwwww",
   "bwbwbbwbbb",
   "wwwwwwwwwb",
   "bwbwbbwbbb",
   "wwwwwwwwwb"
   ];
var ans_key = [
   "GORONTALO-",
   "A-E-----V-",
   "NANTI-E-E-",
   "D-D-PULANG",
   "U-A-A-E---",
   "MAHAR-PADI",
   "-M-N--H---",
   "OBSERVASI-",
   "-I-K--N---",
   "ALMAMATER-"
   ];
var total_rows = values.length;
var total_cols = values[0].length;
var spans_values = {
   "0,0" : "1",
   "2,0" : "2",
   "5,0" : "3",
   "3,4" : "4",
   "5,6" : "5",
   "7,0" : "6",
   "9,0" : "7",
   "0,2" : "2",
   "0,8" : "3",
   "2,4" : "4",
   "2,6" : "5",
   "5,1" : "6",
   "5,3" : "7",
   };
var current = null;

function createFrameBoxes() {
   var boxes = "";
   for (let i = 0; i < values.length; i++) {
      boxes += "<tr>";
      for (let j = 0; j < values[i].length; j++) {
         var s = spans_values[i + "," + j] ?? "";
         boxes += `<th onclick='myclick(this)' row='${i}' col='${j}' class="${values[i][j]}"><span>${s}</span><b></b></th>`;
         }
         boxes += `</tr>`;
   }
   document.getElementById("table").innerHTML = boxes;
}

createFrameBoxes();

var isVertical = false; // Default: highlight horizontal

function highlightCells() {
   // Reset semua kotak
   document.querySelectorAll(".w").forEach(cell => cell.style.backgroundColor = "transparent");

   var row = parseInt(current.getAttribute("row"));
   var col = parseInt(current.getAttribute("col"));

   // Highlight otomatis berdasarkan kotak di sekitar
   var isTopBlack = (row == 0 || (row > 0 && document.querySelector(`[row="${row - 1}"][col="${col}"]`).classList.contains("b")));
   var isBottomBlack = (row == total_rows - 1 || (row < total_rows - 1 && document.querySelector(`[row="${row + 1}"][col="${col}"]`).classList.contains("b")));
   var isLeftBlack = (col == 0 || (col > 0 && document.querySelector(`[row="${row}"][col="${col - 1}"]`).classList.contains("b")));
   var isRightBlack = (col == total_cols - 1 || (col < total_cols - 1 && document.querySelector(`[row="${row}"][col="${col + 1}"]`).classList.contains("b")));

   if (isTopBlack && isBottomBlack) {
      isVertical = false; // Highlight horizontal
   } else if (isLeftBlack && isRightBlack) {
      isVertical = true; // Highlight vertical
   }

   // Highlight kotak berdasarkan arah
   if (isVertical) {
      // Highlight secara vertikal
      for (let r = row; r >= 0 && !document.querySelector(`[row="${r}"][col="${col}"]`).classList.contains("b"); r--) {
         document.querySelector(`[row="${r}"][col="${col}"]`).style.backgroundColor = "lightblue";
      }
      for (let r = row + 1; r < total_rows && !document.querySelector(`[row="${r}"][col="${col}"]`).classList.contains("b"); r++) {
         document.querySelector(`[row="${r}"][col="${col}"]`).style.backgroundColor = "lightblue";
      }
   } else {
      // Highlight secara horizontal
      for (let c = col; c >= 0 && !document.querySelector(`[row="${row}"][col="${c}"]`).classList.contains("b"); c--) {
         document.querySelector(`[row="${row}"][col="${c}"]`).style.backgroundColor = "lightblue";
      }
      for (let c = col + 1; c < total_cols && !document.querySelector(`[row="${row}"][col="${c}"]`).classList.contains("b"); c++) {
         document.querySelector(`[row="${row}"][col="${c}"]`).style.backgroundColor = "lightblue";
      }
   }
}

function myclick(box) {
   if (box.classList.contains("w")) {
      var row = box.getAttribute("row");
      var col = box.getAttribute("col");
      if (current === box) {
         // Double-click: toggle arah highlight
         isVertical = !isVertical;
      } else {
         current = box; // Set kotak aktif
      }
      highlightCells();
      current.style.background="orange";
   }
}

document.body.onkeyup = function (event) {
   if (current != null) {
      // Pindah sesuai tombol panah
      if (event.keyCode >= 37 && event.keyCode <= 40) {
         nextmover(event.keyCode);
      }

      // Masukkan huruf
      if (event.keyCode >= 65 && event.keyCode <= 90) { 
         current.querySelector("b").innerHTML = event.key.toUpperCase();

         // Tentukan posisi saat ini
         var row = parseInt(current.getAttribute("row"));
         var col = parseInt(current.getAttribute("col"));
         
         // Cek arah gerakan
         if (isVertical) {
            // Cek jika posisi di ujung atas atau bawah
            if (row < total_rows - 1 && !document.querySelector(`[row="${row + 1}"][col="${col}"]`).classList.contains("b")) {
               nextmover(40); // Pindah ke bawah
            } // Jika sudah di ujung bawah atau ada kotak hitam di bawah, kursor tetap diam
         } else {
            // Cek jika posisi di ujung kiri atau kanan
            if (col < total_cols - 1 && !document.querySelector(`[row="${row}"][col="${col + 1}"]`).classList.contains("b")) {
               nextmover(39); // Pindah ke kanan
            } // Jika sudah di ujung kanan atau ada kotak hitam di kanan, kursor tetap diam
         }
      }

      // Hapus huruf
      if (event.keyCode == 8 || event.keyCode == 46) { // Backspace atau Delete
         if (current.querySelector("b").innerHTML.trim() !== "") {
            // Hapus huruf
            current.querySelector("b").innerHTML = ""; 

            // Tentukan posisi saat ini
            var row = parseInt(current.getAttribute("row"));
            var col = parseInt(current.getAttribute("col"));

            // Pindah ke arah berlawanan hanya jika ada huruf yang dihapus
            if (isVertical) {
               // Cek jika berada di ujung atas atau bawah
               if (row > 0 && !document.querySelector(`[row="${row - 1}"][col="${col}"]`).classList.contains("b")) {
                  nextmover(38); // Pindah ke atas
               } // Jika sudah di ujung atas atau ada kotak hitam di atas, kursor tetap diam
            } else {
               // Cek jika berada di ujung kiri atau kanan
               if (col > 0 && !document.querySelector(`[row="${row}"][col="${col - 1}"]`).classList.contains("b")) {
                  nextmover(37); // Pindah ke kiri
               } // Jika sudah di ujung kiri atau ada kotak hitam di kiri, kursor tetap diam
            }
         }
      }
   }
}



function submitAnswers() {
   var score = 0;
   red.splice(0);
   green.splice(0);
   var whites = document.querySelectorAll(".w");
   var allFilled = true;
   whites.forEach(element => {
      if (element.querySelector("b").innerHTML.trim() === "") {
         allFilled = false;
      }
   });

   if (!allFilled) {
      document.getElementById("warningMessage").innerHTML = "Isi semua kotak putih!";
      return;
   } else {
      document.getElementById("warningMessage").innerHTML = "";
   }
   whites.forEach(element => {
      var text = element.querySelector("b").innerHTML;
      if (text.length > 0) {
         var row = element.getAttribute("row");
         var col = element.getAttribute("col");

         if (text == ans_key[row][col]) {
            green.push(element);
            score++;
         }
      }
   });

   // Update score display in a new element below the button
   var totalQuestions = whites.length;
   var scorePercentage = (score / totalQuestions) * 100;
   document.getElementById("score").innerHTML = "Score: " + scorePercentage.toFixed(2) + "% (" + score + "/" + totalQuestions + ")";
   
   // Display the CHECK button
   document.getElementById("checkButton").style.display = "inline-block";
   document.getElementById("submitButton").style.display = "none";

   // Menampilkan tombol reset
   document.getElementById("resetButton").style.display = "inline-block";
}

function nextmover(code) {
   var row = parseInt(current.getAttribute("row"));
   var col = parseInt(current.getAttribute("col"));

   switch (code) { 
      case 37:
         col = col == 0 ? total_cols-1 : col - 1
         break;
      case 38:
         row = row == 0 ? total_rows-1 : row - 1
         break;
      case 39:
         col = col == total_cols-1 ? 0 : col + 1
         break;
      case 40:
         row = row == total_rows-1 ? 0 : row + 1
         break;
      default:
         break;
   }

   if (current.classList.contains("w")) {
      current.style.backgroundColor = "transparent"
   }
   
   current = document.querySelectorAll("tr")[row].querySelectorAll("th")[col];
   
   if (current.classList.contains("b")) {
      nextmover(code);
   }
   else {
      highlightCells();
      current.style.backgroundColor = "orange";
   }
}

var red=[];
var green = []

function key_check() {
   red.splice(0);
   green.splice(0);
   var whites = document.querySelectorAll(".w");
   whites.forEach(element => {
      var text = element.querySelector("b").innerHTML;
      if (text.length > 0) {
         var row = element.getAttribute("row");
         var col = element.getAttribute("col");

         if (text == ans_key[row][col]) {
            element.style.background = "greenyellow";
            green.push(element);
         }
         else {
            element.style.background = "red";
            red.push(element);
         }
      }
   });
   if (green.length == whites.length) {
      
   }
}

function color_clear() {
   red.forEach(element => {
      element.style.background = "transparent";
      element.querySelector("b").innerHTML = "";
   });
   green.forEach(element => {
      element.style.background = "transparent";
   })

   red.splice(0);
   green.splice(0);
}

function resetAnswers() {
   // Menghapus semua isi pada kotak jawaban
   document.querySelectorAll(".w b").forEach(b => b.innerHTML = "");

   // Menghilangkan warna hijau dan merah
   green.forEach(element => element.style.background = "transparent");
   red.forEach(element => element.style.background = "transparent");

   // Menampilkan kembali tombol submit dan menyembunyikan tombol reset
   document.getElementById("submitButton").style.display = "inline-block";
   document.getElementById("resetButton").style.display = "none";
   document.getElementById("warningMessage").innerHTML = "";
   document.getElementById("checkButton").style.display = 

   // Menghapus tampilan skor
   document.getElementById("scoreDisplay").innerHTML = "";

   // Membuka kembali tabel untuk pengetikan
   isLocked = false;
}

