/**
 * Класс FileUploaderModal
 * Используется как всплывающее окно для загрузки изображений
 */
class FileUploaderModal extends BaseModal {
  constructor(element) {
    super(element);
    this.uploaderWindow = document.querySelector(".file-uploader-modal");
    this.contenContainer = this.domElement.querySelector(".content");
    this.closeButton = this.domElement.querySelector(".close");
    this.sendAllButton = this.domElement.querySelector(".send-all");
    this.registerEvents();
  }

  /**
   * Добавляет следующие обработчики событий:
   * 1. Клик по крестику на всплывающем окне, закрывает его
   * 2. Клик по кнопке "Закрыть" на всплывающем окне, закрывает его
   * 3. Клик по кнопке "Отправить все файлы" на всплывающем окне, вызывает метод sendAllImages
   * 4. Клик по кнопке загрузке по контроллерам изображения:
   * убирает ошибку, если клик был по полю вода
   * отправляет одно изображение, если клик был по кнопке отправки
   */
  registerEvents() {
    this.uploaderWindow
      .querySelector(".header .x")
      .addEventListener("click", this.close);

    // Обработчик кнопки закрытия окна
    this.closeButton.addEventListener("click", this.close);

    // Обработчик кнопки "Отправить все"
    this.sendAllButton.addEventListener("click", this.sendAllImages.bind(this));

    // Обоаботчик кнопки отправить на конкретной фотографии и поля вводы имени файла
    this.contenContainer.addEventListener("click", (event) => {
      if (
        event.target ===
        document.querySelector(".file-uploader-modal .content .input")
      ) {
        if (this.contenContainer.classList.contains("error")) {
          this.contenContainer.classList.remove("error");
        }
      }
      if (
        event.target.classList.contains("button") ||
        event.target.classList.contains("upload")
      ) {
        this.sendImage(event.target.closest(".image-preview-container"));
      }
    });
  }

  /**
   * Отображает все полученные изображения в теле всплывающего окна
   */
  showImages(images) {
    images.reverse();
    const arrayOfImagesHTML = [];
    for (const image of images) {
      arrayOfImagesHTML.push(this.getImageHTML(image));
    }
    this.contenContainer.innerHTML = arrayOfImagesHTML.join("");
  }

  /**
   * Формирует HTML разметку с изображением, полем ввода для имени файла и кнопкной загрузки
   */
  getImageHTML(item) {
    return `<div class="image-preview-container">
                <img src='${item}' />
                <div class="ui action input">
                    <input type="text" placeholder="Путь к файлу">
                    <button class="ui button"><i class="upload icon"></i></button>
                </div>
            </div>`;
  }

  /**
   * Отправляет все изображения в облако
   */
  sendAllImages() {
    for (const imageContainer of Array.from(
      this.contenContainer.querySelectorAll(".image-preview-container")
    )) {
      this.sendImage(imageContainer);
    }
  }

  /**
   * Валидирует изображение и отправляет его на сервер
   */
  sendImage(imageContainer) {
    if (imageContainer.querySelector("input").value.trim()) {
      imageContainer.querySelector(".input").classList.add("disabled");
      Yandex.uploadFile(
        imageContainer.querySelector("input").value,
        imageContainer.querySelector("img").src,
        () => {
          imageContainer.remove();
          if (
            document.querySelector(".file-uploader-modal .content").children
              .length === 0
          ) {
            this.close();
          }
        }
      );
    } else {
      imageContainer.querySelector(".input").classList.add("error");
    }
  }
}