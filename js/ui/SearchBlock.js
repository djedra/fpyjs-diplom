/**
 * Класс SearchBlock
 * Используется для взаимодействием со строкой ввода и поиска изображений
 * */
class SearchBlock {
  constructor(element) {
    this.element = element;
    this.registerEvents();
  }

  /**
   * Выполняет подписку на кнопки "Заменить" и "Добавить"
   * Клик по кнопкам выполняет запрос на получение изображений и отрисовывает их,
   * только клик по кнопке "Заменить" перед отрисовкой очищает все отрисованные ранее изображения
   */
  registerEvents() {
    this.element.addEventListener("click", findImages);

    function findImages(event) {
      const input = this.getElementsByTagName("input")[0];

      if (input.value.trim()) {
        // Срабатывает на кнопке .add
        if (event.target.classList.contains("add")) {
          delete VK.lastCallback.listFromCallback;
          VK.get(input.value);
          let interval = setInterval(() => {
            if (VK.lastCallback.listFromCallback) {
              App.imageViewer.drawImages();
              clearInterval(interval);
            }
          }, 0);
        }

        // Срабатывает на кнопке .replace
        if (event.target.classList.contains("replace")) {
          if (VK.lastCallback.listFromCallback) {
            delete VK.lastCallback.listFromCallback;
          }
          VK.get(input.value);
          let interval = setInterval(() => {
            if (VK.lastCallback.listFromCallback) {
              App.imageViewer.clear();
              App.imageViewer.drawImages();
              clearInterval(interval);
            }
          }, 0);
        }
      }
    }
  }
}