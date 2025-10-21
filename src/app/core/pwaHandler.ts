import { inject, Injectable } from "@angular/core";
import { SwUpdate, VersionEvent } from "@angular/service-worker";

@Injectable({ providedIn: 'root' })
export class PwaHandler {
    private swUpdate = inject(SwUpdate);

    constructor() {}

    subscribeToUpdates() {
        if (this.swUpdate.isEnabled) {
            this.swUpdate.versionUpdates.subscribe((event: VersionEvent) => {
                if (event.type === 'VERSION_READY') {
                    this.promptUserForUpdate();
                }
            });
        }
    }

    private promptUserForUpdate() {
        const reload = confirm('A new version of the app is available. Reload now to update?');

        if (reload) {
            this.swUpdate.activateUpdate().then(() => document.location.reload());
        }
    }
}