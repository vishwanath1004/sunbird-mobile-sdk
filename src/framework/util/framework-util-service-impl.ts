import {FrameworkUtilService} from './framework-util-service';
import {SharedPreferences} from '../../util/shared-preferences';
import {CategoryTerm, Channel, Framework, FrameworkService, GetFrameworkCategoryTermsRequest} from '..';
import {Observable} from 'rxjs';
import {GetSuggestedFrameworksRequest} from './requests';
import {FrameworkMapper} from './framework-mapper';
import {Profile, ProfileService} from '../../profile';
import {GetFrameworkCategoryTermsHandler} from '../handler/get-framework-category-terms-handler';
import { injectable, inject } from 'inversify';
import { InjectionTokens } from '../../injection-tokens';

@injectable()
export class FrameworkUtilServiceImpl implements FrameworkUtilService {
    constructor(@inject(InjectionTokens.SHARED_PREFERENCES) private sharedPreferences: SharedPreferences,
                @inject(InjectionTokens.FRAMEWORK_SERVICE) private frameworkService: FrameworkService,
                @inject(InjectionTokens.PROFILE_SERVICE) private profileService: ProfileService) {
    }

    public getActiveChannel(): Observable<Channel> {
        return this.frameworkService.getActiveChannelId()
            .mergeMap((channelId: string) =>
                this.frameworkService.getChannelDetails({channelId})
            );
    }

    public getActiveChannelSuggestedFrameworkList(getSuggestedFrameworksRequest: GetSuggestedFrameworksRequest): Observable<Framework[]> {
        return this.profileService.getActiveSessionProfile({requiredFields: []})
            .mergeMap((profile: Profile) =>
                Observable.if(
                    () => !!profile.serverProfile && !getSuggestedFrameworksRequest.ignoreActiveChannel,
                    Observable.defer(() => this.getActiveChannel()),
                    Observable.defer(() => this.frameworkService.getDefaultChannelDetails())
                )
            )
            .mergeMap((channel: Channel) => {
                if (channel.frameworks) {
                    return Observable.of(channel.frameworks)
                        .map((frameworks) =>
                            frameworks
                                .map((f) => FrameworkMapper.prepareFrameworkCategoryAssociations(f))
                                .map((f) => FrameworkMapper.prepareFrameworkTranslations(
                                    f, getSuggestedFrameworksRequest.language)
                                )
                        );
                }

                return this.frameworkService.getFrameworkDetails({
                    frameworkId: channel.defaultFramework,
                    requiredCategories: getSuggestedFrameworksRequest.requiredCategories
                }).map((framework: Framework) => {
                    framework.index = 0;
                    return [framework];
                });
            });
    }

    public getFrameworkCategoryTerms(request: GetFrameworkCategoryTermsRequest): Observable<CategoryTerm[]> {
        return new GetFrameworkCategoryTermsHandler(
            this,
            this.frameworkService,
            this.sharedPreferences
        ).handle(request);
    }
}
