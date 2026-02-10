export interface Job {
    handle(): Promise<void>;
}

export class Queue {
    private jobs: Job[] = [];
    private isProcessing: boolean = false;

    public dispatch(job: Job) {
        this.jobs.push(job);
        console.log(`Job dispatched. Queue size: ${this.jobs.length}`);
        this.process();
    }

    private async process() {
        if (this.isProcessing || this.jobs.length === 0) return;

        this.isProcessing = true;
        const job = this.jobs.shift();

        if (job) {
            try {
                console.log('Processing job...');
                await job.handle();
                console.log('Job processed successfully.');
            } catch (error) {
                console.error('Job failed:', error);
            }
        }

        this.isProcessing = false;

        // Process next job
        if (this.jobs.length > 0) {
            this.process();
        }
    }
}

export const QueueManager = new Queue();
