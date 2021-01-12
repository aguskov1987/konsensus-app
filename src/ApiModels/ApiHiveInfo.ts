import {HiveInfoVm} from "../ViewModels/HiveInfoVm";

export class ApiHiveInfo {
    public id: string = '';
    public title: string = '';
    public description: string = '';
    public responseDecay: number = 0;
    public dormantNeuronLifespan: number = 0;
    public maxNeuronsInGraph: number = 1000;

    public toVm(): HiveInfoVm {
        return new HiveInfoVm()
    }
}