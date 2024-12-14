/**
 * Класс BaseModal
 * Используется как базовый класс всплывающего окна
 */
class BaseModal {
  constructor(element) {
    this.domElement = element[0];
  }

  /**
   * Открывает всплывающее окно
   */
  open() {
    $(`.ui.modal.${this.domElement.classList[2]}`).modal("show");
  }

  /**
   * Закрывает всплывающее окно
   */
  close() {
    $(`.ui.modal`).modal("hide");
  }
}