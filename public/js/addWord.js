document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('addWordForm');
  const meaningsContainer = document.getElementById('meaningsContainer');
  const addMeaningBtn = document.getElementById('addMeaningBtn');
  const addWordBtn = document.getElementById('addWordBtn');
  const wordListContainer = document.getElementById('wordListContainer');

  let meaningCount = 1;

  function createExampleGroup(meaningIndex, exampleIndex) {
      const exampleGroup = document.createElement('div');
      exampleGroup.className = 'example-group';
      exampleGroup.innerHTML = `
          <div class="form-group">
              <label for="example${meaningIndex}_${exampleIndex}">예문</label>
              <input type="text" id="example${meaningIndex}_${exampleIndex}" name="example${meaningIndex}_${exampleIndex}" required>
          </div>
          <div class="form-group">
              <label for="translation${meaningIndex}_${exampleIndex}">해석</label>
              <input type="text" id="translation${meaningIndex}_${exampleIndex}" name="translation${meaningIndex}_${exampleIndex}" required>
          </div>
      `;
      return exampleGroup;
  }

  function addExampleToMeaning(meaningGroup, meaningIndex) {
      const examplesContainer = meaningGroup.querySelector('.examples-container');
      const existingExamples = examplesContainer.querySelectorAll('.example-group');
      const newExampleIndex = existingExamples.length + 1;
      examplesContainer.appendChild(createExampleGroup(meaningIndex, newExampleIndex));
  }

  function createMeaningGroup(index) {
      const meaningGroup = document.createElement('div');
      meaningGroup.className = 'meaning-group';
      meaningGroup.innerHTML = `
          <div class="form-group">
              <label for="partOfSpeech${index}">품사</label>
              <input type="text" id="partOfSpeech${index}" name="partOfSpeech${index}" required>
          </div>
          <div class="form-group">
              <label for="meaning${index}">뜻</label>
              <input type="text" id="meaning${index}" name="meaning${index}" required>
          </div>
          <div class="examples-container">
              ${createExampleGroup(index, 1).outerHTML}
          </div>
          <button type="button" class="add-example-btn">예문 추가</button>
      `;

      return meaningGroup;
  }

  addMeaningBtn.addEventListener('click', function() {
      meaningCount++;
      const newMeaningGroup = createMeaningGroup(meaningCount);
      meaningsContainer.appendChild(newMeaningGroup);
  });

  // 이벤트 위임: 의미 그룹에 있는 '예문 추가' 버튼 클릭을 상위 요소에서 처리
  meaningsContainer.addEventListener('click', function(event) {
      if (event.target && event.target.classList.contains('add-example-btn')) {
          const meaningGroup = event.target.closest('.meaning-group');
          const meaningIndex = Array.from(meaningsContainer.children).indexOf(meaningGroup) + 1;
          addExampleToMeaning(meaningGroup, meaningIndex);
      }
  });

  addWordBtn.addEventListener('click', function() {
      const wordData = getFormData();
      if (validateWordData(wordData)) {
          addWordToList(wordData);
          resetForm();
      } else {
          alert('모든 필드를 채워주세요.');
      }
  });

  function getFormData() {
      const word = document.getElementById('word').value;
      const pronunciation = document.getElementById('pronunciation').value;
      const meanings = [];

      document.querySelectorAll('.meaning-group').forEach((meaningGroup, index) => {
          const partOfSpeech = meaningGroup.querySelector(`#partOfSpeech${index + 1}`).value;
          const meaning = meaningGroup.querySelector(`#meaning${index + 1}`).value;
          const examples = [];

          meaningGroup.querySelectorAll('.example-group').forEach((exampleGroup, exampleIndex) => {
              const example = exampleGroup.querySelector(`#example${index + 1}_${exampleIndex + 1}`).value;
              const translation = exampleGroup.querySelector(`#translation${index + 1}_${exampleIndex + 1}`).value;
              if (example && translation) {
                  examples.push({ example, translation });
              }
          });

          if (partOfSpeech && meaning) {
              meanings.push({ partOfSpeech, meaning, examples });
          }
      });

      return { word, pronunciation, meanings };
  }

  function validateWordData(wordData) {
      return wordData.word && wordData.pronunciation && wordData.meanings.length > 0;
  }

  function addWordToList(wordData) {
      const wordItem = document.createElement('div');
      wordItem.className = 'word-item';
      
      let meaningsHtml = '';
      wordData.meanings.forEach((meaning, index) => {
          let examplesHtml = '';
          meaning.examples.forEach(example => {
              examplesHtml += `
                  <div class="example-item">
                      <p><strong>예문:</strong> ${example.example}</p>
                      <p><strong>해석:</strong> ${example.translation}</p>
                  </div>
              `;
          });

          meaningsHtml += `
              <div class="meaning-item">
                  <p><strong>품사:</strong> ${meaning.partOfSpeech}</p>
                  <p><strong>뜻:</strong> ${meaning.meaning}</p>
                  ${examplesHtml}
              </div>
          `;
      });

      wordItem.innerHTML = `
          <h3>${wordData.word}</h3>
          <p><strong>읽기 방식:</strong> ${wordData.pronunciation}</p>
          ${meaningsHtml}
      `;

      wordListContainer.appendChild(wordItem);
  }

  function resetForm() {
      form.reset();
      while (meaningsContainer.children.length > 1) {
          meaningsContainer.removeChild(meaningsContainer.lastChild);
      }
      meaningCount = 1;
  }
});
