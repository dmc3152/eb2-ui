export class Utilities {
  public static safeAsync = async <T>(promise: Promise<T>): Promise<[Error, undefined] | [undefined, T]> => {
      try {
          const result = await promise;
          return [undefined, result];
      }
      catch (error) {
          return [this.parseError(error), undefined];
      }
    }
    
    public static parseError = (error: unknown) => {
        if (error instanceof Error) return error;
        if (typeof error === 'string') return new Error(error);
        return new Error(JSON.stringify(error));
    }
}
