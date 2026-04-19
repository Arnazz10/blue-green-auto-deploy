import { v4 as uuidv4 } from 'uuid';

export type EnvStatus = 'LIVE' | 'STANDBY' | 'DEPLOYING' | 'FAILED' | 'READY';
export type StageStatus = 'PENDING' | 'RUNNING' | 'SUCCESS' | 'FAILED';

export interface DeploymentStage {
    id: string;
    name: string;
    status: StageStatus;
    duration?: number;
    description: string;
    logs: string[];
}

export interface DeploymentRun {
    id: string;
    version: string;
    targetEnv: 'BLUE' | 'GREEN';
    status: 'IN_PROGRESS' | 'SUCCESS' | 'FAILED' | 'ROLLBACK';
    startTime: number;
    endTime?: number;
    triggeredBy: string;
    stages: DeploymentStage[];
}

export interface EnvState {
    name: 'BLUE' | 'GREEN';
    version: string;
    imageDigest: string;
    podCount: number;
    status: EnvStatus;
    uptime: string;
    lastDeployed: string;
    trafficPercent: number;
}

class MockEngine {
    private static instance: MockEngine;
    private state: {
        blue: EnvState;
        green: EnvState;
        deployments: DeploymentRun[];
        logs: Record<string, string[]>;
    } = {
        blue: {
            name: 'BLUE',
            version: 'v2.0.8',
            imageDigest: 'sha256:d72b3e...',
            podCount: 5,
            status: 'LIVE',
            uptime: '14d 6h',
            lastDeployed: '2026-04-05 09:12',
            trafficPercent: 100,
        },
        green: {
            name: 'GREEN',
            version: 'v2.0.7',
            imageDigest: 'sha256:a1b2c3...',
            podCount: 5,
            status: 'STANDBY',
            uptime: '14d 6h',
            lastDeployed: '2026-04-05 08:30',
            trafficPercent: 0,
        },
        deployments: [],
        logs: {},
    };

    private constructor() {}

    public static getInstance(): MockEngine {
        if (!MockEngine.instance) {
            MockEngine.instance = new MockEngine();
        }
        return MockEngine.instance;
    }

    public getState() {
        return this.state;
    }

    public getDeployment(id: string) {
        return this.state.deployments.find(d => d.id === id);
    }

    public async triggerDeploy() {
        const id = Math.random().toString(36).substring(7);
        const newVersion = `v2.1.0-${Math.random().toString(36).substring(2, 8)}`;
        
        const run: DeploymentRun = {
            id,
            version: newVersion,
            targetEnv: 'GREEN',
            status: 'IN_PROGRESS',
            startTime: Date.now(),
            triggeredBy: 'Arnazz10',
            stages: [
                { id: '1', name: 'Source Checkout', status: 'PENDING', description: 'Checking out branch main...', logs: [] },
                { id: '2', name: 'Docker Build', status: 'PENDING', description: 'Building image arnazz10/app...', logs: [] },
                { id: '3', name: 'Push to Registry', status: 'PENDING', description: 'Pushing to Docker Hub...', logs: [] },
                { id: '4', name: 'Deploy to Green', status: 'PENDING', description: 'Spinning up pods in production-green...', logs: [] },
                { id: '5', name: 'Smoke Tests', status: 'PENDING', description: 'Running health and readiness checks...', logs: [] },
                { id: '6', name: 'Traffic Switch', status: 'PENDING', description: 'Patching k8s service selector...', logs: [] },
                { id: '7', name: 'Teardown / Standby', status: 'PENDING', description: 'Scaling down blue environment...', logs: [] },
            ],
        };

        this.state.deployments.unshift(run);
        this.runSimulation(id);
        return id;
    }

    private async runSimulation(id: string) {
        const run = this.getDeployment(id);
        if (!run) return;

        this.state.green.status = 'DEPLOYING';
        this.state.green.version = run.version;

        for (let i = 0; i < run.stages.length; i++) {
            if (i === 5) {
                // Traffic switch is manual in some dashboards, but here we enable it after health check
                run.stages[4].status = 'SUCCESS';
                this.state.green.status = 'READY';
                // Wait for manual trigger in a real app, but here we can automate or wait for POST /api/switch
                // For this simulation, we'll stop here and wait for the user to click "Switch Traffic"
                break;
            }

            run.stages[i].status = 'RUNNING';
            await new Promise(resolve => setTimeout(resolve, 2000));
            run.stages[i].status = 'SUCCESS';
            run.stages[i].duration = Math.floor(Math.random() * 5000) + 1000;
        }
    }

    public async switchTraffic() {
        const run = this.state.deployments.find(d => d.status === 'IN_PROGRESS' && d.stages[4].status === 'SUCCESS');
        if (!run) return;

        run.stages[5].status = 'RUNNING';
        // Traffic transition simulation
        this.state.blue.trafficPercent = 0;
        this.state.green.trafficPercent = 100;
        this.state.blue.status = 'STANDBY';
        this.state.green.status = 'LIVE';

        await new Promise(resolve => setTimeout(resolve, 2000));
        run.stages[5].status = 'SUCCESS';
        
        run.stages[6].status = 'RUNNING';
        await new Promise(resolve => setTimeout(resolve, 1000));
        run.stages[6].status = 'SUCCESS';
        
        run.status = 'SUCCESS';
        run.endTime = Date.now();
    }

    public async rollback() {
        this.state.blue.trafficPercent = 100;
        this.state.green.trafficPercent = 0;
        this.state.blue.status = 'LIVE';
        this.state.green.status = 'STANDBY';
        
        const lastSuccess = this.state.deployments.find(d => d.status === 'SUCCESS');
        if (lastSuccess) {
            lastSuccess.status = 'ROLLBACK';
        }
    }
}

export const engine = MockEngine.getInstance();
