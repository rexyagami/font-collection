

$(document).ready(function () {
  $('textarea[data-maxwords]').each(function () {
    updateWordCount($(this));
    // Store initial valid value
    $(this).data('lastValid', $(this).val());
  });

  // Desktop keydown guard (still useful for desktop)
  $(document).on('keydown', 'textarea[data-maxwords]', function (e) {
    let $textarea = $(this);
    let maxWords = parseInt($textarea.data('maxwords'));
    let text = $textarea.val();
    let words = text.trim().length ? text.trim().split(/\s+/) : [];
    let wordCount = words.length;
    let cursorPos = this.selectionStart;
    let beforeCursor = text.substring(0, cursorPos);
    let isNewWordStart = /\s$/.test(beforeCursor);

    let allowedKeys = [
      'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight',
      'ArrowUp', 'ArrowDown', 'Tab'
    ];
    if (allowedKeys.includes(e.key)) return;

    if (wordCount >= maxWords && isNewWordStart) {
      e.preventDefault();
    }
  });

  // Handle paste
  $(document).on('paste', 'textarea[data-maxwords]', function (e) {
    let $textarea = $(this);
    setTimeout(() => {
      enforceWordLimit($textarea);
      updateWordCount($textarea);
    }, 0);
  });

  // Core input handler — mobile + desktop
  $(document).on('input', 'textarea[data-maxwords]', function () {
    let $textarea = $(this);
    let maxWords = parseInt($textarea.data('maxwords'));
    let text = $textarea.val();
    let words = text.trim().length ? text.trim().split(/\s+/) : [];
    let wordCount = words.length;

    if (wordCount > maxWords) {
      // ✅ Over limit — restore last valid value, cursor stays at end of last word
      let lastValid = $textarea.data('lastValid') || '';
      $textarea.val(lastValid);

      // Place cursor at end of restored value
      let len = lastValid.length;
      this.setSelectionRange(len, len);
    } else {
      // ✅ Within limit — save this as the new last valid value
      $textarea.data('lastValid', text);
    }

    updateWordCount($textarea);
  });

  function enforceWordLimit($textarea) {
    let maxWords = parseInt($textarea.data('maxwords'));
    let text = $textarea.val().trim();
    let words = text.length ? text.split(/\s+/) : [];
    if (words.length > maxWords) {
      let allowed = words.slice(0, maxWords).join(' ');
      $textarea.val(allowed);
      $textarea.data('lastValid', allowed);
    }
  }

  function updateWordCount($textarea) {
    let maxWords = parseInt($textarea.data('maxwords'));
    let text = $textarea.val().trim();
    let words = text.length ? text.split(/\s+/) : [];
    let wordCount = words.length;
    let $counter = $textarea.closest('.form-group').find('.word-count');
    $counter.text(wordCount + ' / ' + maxWords + ' words');
  }
});