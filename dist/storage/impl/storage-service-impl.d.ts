import { StorageDestination, StorageService, TransferContentsRequest } from '..';
import { Observable } from 'rxjs';
import { Content } from '../../content';
import { EventsBusService } from '../../events-bus';
import { SharedPreferences } from '../../util/shared-preferences';
import { DbService } from '../../db';
import { DeviceInfo, StorageVolume } from '../../util/device';
export declare class StorageServiceImpl implements StorageService {
    private eventsBusService;
    private sharedPreferences;
    private dbService;
    private deviceInfo;
    private static readonly STORAGE_DESTINATION;
    private transferringContent$;
    private contentsToTransfer;
    constructor(eventsBusService: EventsBusService, sharedPreferences: SharedPreferences, dbService: DbService, deviceInfo: DeviceInfo);
    onInit(): Observable<undefined>;
    getStorageDestinationVolumeInfo(): Observable<StorageVolume>;
    getStorageDestination(): Observable<StorageDestination>;
    getToTransferContents(): Observable<Content[]>;
    getTransferringContent(): Observable<Content | undefined>;
    cancelTransfer(): Observable<undefined>;
    retryCurrentTransfer(): Observable<undefined>;
    transferContents(transferContentsRequest: TransferContentsRequest): Observable<undefined>;
    private contentsToTransferEmptied;
    private transferSingleContent;
    private deleteTempDirectoriesIfAny;
    private revertTransferIfAny;
    private getContentsToTransfer;
    private addContentsToTransferQueue;
    private switchToNextContent;
    private pauseTransferContentIfAny;
    private clearTransferQueue;
    private endTransfer;
    private emitErrorEvent;
}
