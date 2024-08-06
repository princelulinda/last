import 'jest-preset-angular/setup-jest';
import '@angular/localize/init';

(window as any).google = {
  maps: {
    Size: function (width: number, height: number) {
      return { width, height };
    },
    Point: function (x: number, y: number) {
      return { x, y };
    },
    importLibrary: async function (libraryName: string) {
      return new Promise(resolve => {
        resolve({
          maps: {
            Size: function (width: number, height: number) {
              return { width, height };
            },
            Point: function (x: number, y: number) {
              return { x, y };
            },
          },
        });
      });
    },
  },
};
