/**
 * Pipeline - Advanced request/data processing pipeline
 */

export type PipelineCallback<T> = (value: T) => T | Promise<T>;

export class Pipeline<T> {
  private pipes: PipelineCallback<T>[] = [];

  through(...callbacks: PipelineCallback<T>[]): this {
    this.pipes.push(...callbacks);
    return this;
  }

  async process(value: T): Promise<T> {
    let result = value;
    
    for (const pipe of this.pipes) {
      result = await pipe(result);
    }
    
    return result;
  }

  then(callback: (value: T) => void | Promise<void>): this {
    this.pipes.push(async (value) => {
      await callback(value);
      return value;
    });
    return this;
  }

  map<U>(callback: (value: T) => U | Promise<U>): Pipeline<U> {
    const newPipeline = new Pipeline<U>();
    newPipeline.pipes = [];
    
    for (const pipe of this.pipes) {
      newPipeline.pipes.push(async (value: any) => {
        const processed = await pipe(value);
        return callback(processed);
      });
    }
    
    return newPipeline;
  }

  filter(callback: (value: T) => boolean): this {
    this.pipes.push((value) => {
      if (!callback(value)) {
        throw new Error('Value filtered out');
      }
      return value;
    });
    return this;
  }

  catch(callback: (error: Error) => T): Pipeline<T> {
    const oldProcess = this.process.bind(this);
    this.process = async (value: T) => {
      try {
        return await oldProcess(value);
      } catch (error) {
        return callback(error as Error);
      }
    };
    return this;
  }
}
