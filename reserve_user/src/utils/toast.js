import { Toast } from "vant";

export function successToast(message, duration) {
  Toast.clearAll(true);
  Toast.success({
    message,
    duration
  });
}

export function failToast(message, duration) {
  Toast.clearAll(true);
  Toast.fail({
    message,
    duration
  });
}

export function loadingToast(message, duration) {
  Toast.clearAll(true);
  Toast.loading({
    message,
    duration
  });
}
