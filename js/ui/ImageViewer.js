/**
 * Класс ImageViewer
 * Используется для взаимодействием блоком изображений
 * */
class ImageViewer {
  constructor(element) {
    this.element = element; // images-wrapper
    this.previewBlock = this.element.querySelector(".image");
    this.imageList = this.element.querySelector(".images-list .grid .row");
    this.registerEvents();
  }

  /**
   * Добавляет следующие обработчики событий:
   * 1. Клик по изображению меняет класс активности у изображения
   * 2. Двойной клик по изображению отображает изображаения в блоке предпросмотра
   * 3. Клик по кнопке выделения всех изображений проверяет у всех ли изображений есть класс активности?
   * Добавляет или удаляет класс активности у всех изображений
   * 4. Клик по кнопке "Посмотреть загруженные файлы" открывает всплывающее окно просмотра загруженных файлов
   * 5. Клик по кнопке "Отправить на диск" открывает всплывающее окно для загрузки файлов
   */
  registerEvents() {
    // Двойной клик по превьюшке фотографии
    this.imageList.addEventListener("dblclick", (event) => {
      if (event.target.tagName.toLowerCase() === "img") {
        this.previewBlock.src = event.target.src;
      }
    });

    // Одинарный клик по превьюшке фотографии
    this.imageList.addEventListener("click", (event) => {
      if (event.target.tagName.toLowerCase() === "img") {
        event.target.classList.toggle("selected");
      }
      this.checkButtonText();
    });

    // Клик по кнопке "Выбрать всё" / "Снять выделение"
    this.element.querySelector(".select-all").addEventListener("click", () => {
      const allImages = Array.from(this.imageList.querySelectorAll("img"));
      if (allImages.some((element) => element.classList.contains("selected"))) {
        allImages.map((item) => {
          if (item.classList.contains("selected")) {
            item.classList.remove("selected");
          }
        });
      } else {
        allImages.map((item) => {
          item.classList.add("selected");
        });
      }
      this.checkButtonText();
    });

    // Клик по кнопке "Посмотреть загруженные файлы"
    this.element
      .querySelector(".show-uploaded-files")
      .addEventListener("click", () => {
        const getImgModal = App.getModal("filePreviewer");

        if (
          !document.querySelector(
            ".uploaded-previewer-modal .content .asterisk"
          )
        ) {
          document.querySelector(
            ".uploaded-previewer-modal .content"
          ).innerHTML = '<i class="asterisk loading icon massive"></i>';
        }

        getImgModal.open();

        Yandex.getUploadedFiles((json) => {
          getImgModal.showImages(json);
        });
      });

    // Клик по кнопке "Отправить на диск"
    this.element.querySelector(".send").addEventListener("click", () => {
      const sendModal = App.getModal("fileUploader");
      const allSelectedImgs = this.imageList.querySelectorAll(".selected");

      sendModal.open();

      sendModal.showImages(
        Array.from(allSelectedImgs).map((image) => image.src)
      );
    });
  }

  /**
   * Очищает отрисованные изображения
   */
  clear() {
    document.querySelector(".images-list .grid .row").innerHTML = "";
  }

  /**
   * Отрисовывает изображения.
   */
  drawImages() {
    if (VK.lastCallback.listFromCallback.length > 0) {
      this.element.querySelector(".select-all").classList.remove("disable");
      for (const image of VK.lastCallback.listFromCallback) {
        let img = document.createElement("div");
        img.classList.add(
          "four",
          "wide",
          "column",
          "ui",
          "medium",
          "image-wrapper"
        );
        img.innerHTML = `<img src='${image}' />`;
        this.imageList.appendChild(img);
      }
    } else {
      if (
        !this.element.querySelector(".select-all").classList.contains("disable")
      ) {
        this.element.querySelector(".select-all").classList.add("disable");
      }
    }

    const selectAllBnt = this.element.querySelector(".select-all");
    if (
      Array.from(this.imageList.querySelectorAll("img")).length > 0 &&
      selectAllBnt.classList.contains("disabled")
    ) {
      selectAllBnt.classList.remove("disabled");
    }
  }

  /**
   * Контроллирует кнопки выделения всех изображений и отправки изображений на диск
   */
  checkButtonText() {
    const allImages = Array.from(this.imageList.querySelectorAll("img"));
    const selectAllBnt = this.element.querySelector(".select-all");
    const sendBtn = this.element.querySelector(".send");
    if (allImages.some((element) => element.classList.contains("selected"))) {
      selectAllBnt.textContent = "Снять выделение";
    } else {
      selectAllBnt.textContent = "Выбрать всё";
    }

    if (allImages.some((element) => element.classList.contains("selected"))) {
      sendBtn.classList.remove("disabled");
    } else {
      if (!sendBtn.classList.contains("disabled")) {
        sendBtn.classList.add("disabled");
      }
    }
  }
}