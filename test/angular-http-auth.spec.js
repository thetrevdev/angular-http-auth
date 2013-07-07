
describe('services', function () {


    describe('HttpInterceptor', function () {

        angular.module('testapp', ['http-auth-interceptor']);
        

        beforeEach(module('testapp'));

        var $httpBackend, $http, $rootScope, authService;

        beforeEach(inject(function ($injector) {
            $httpBackend = $injector.get('$httpBackend');
            $http = $injector.get('$http');
            $rootScope = $injector.get('$rootScope');
            authService = $injector.get('authService');
        }));

        afterEach(function () {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });


        it('should request login then retry after confirmed', function () {
            var loginRequiredListener = jasmine.createSpy();
            var httpSuccessListener = jasmine.createSpy();
            var httpErrorListener = jasmine.createSpy();
            
            $httpBackend.expectGET('/secure').respond(401, 'bad');
                        
            $rootScope.$on('event:auth-loginRequired', loginRequiredListener);

            $http.get('/secure').success(httpSuccessListener).error(httpErrorListener);

            $httpBackend.flush();

            expect(loginRequiredListener).toHaveBeenCalled();
            
            $httpBackend.expectGET('/secure').respond(200, 'good');
            authService.loginConfirmed();
           
            $httpBackend.flush();
                        
            expect(httpSuccessListener).toHaveBeenCalled();
            expect(httpSuccessListener.callCount).toEqual(1);
            expect(httpErrorListener).not.toHaveBeenCalled();
        });
    });

});