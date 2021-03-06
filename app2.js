/// <reference path="node_modules/@types/jquery/index.d.ts" />
/// <reference path="node_modules/@types/faker/index.d.ts" />
/// <reference path="node_modules/@progress/kendo-ui/index.d.ts" />

(function (vaApp, $, undefined) {
    let Lookup = {
        equipmentStatus: ['In Service','Returned','Other'],
        equipmentType: ['Laptop','Monitor','Other'],
        period: ['Base Year','Option Year 1','Option Year 2','Option Year 3','Option Year 4'],
        pivStatus: ['Expired','Issued','Surrendered'],
        workStatus: ['In Progress','Onboarded','Offboarded'],
        random: (array) => { return array[Math.floor(Math.random() * array.length)]; }
    }

    $.model = new kendo.observable({
        // set the default digest value - required for post operations
        _digest: $('#__REQUESTDIGEST').val(),

        _siteUrl: _spPageContextInfo.webServerRelativeUrl,

        spLaborCategoryList: "/_api/web/lists/getbytitle('Labor Category')/items",
        spLaborCategoryListArgs: '?$select=Id,Title&$orderby=Title asc&$top=500',
        laborCategoryUrl: () => {
            return $.model._siteUrl + $.model.spLaborCategoryList
        },

        spCompaniesList: "/_api/web/lists/getbytitle('Companies')/items",
        spCompaniesListArgs: '?$select=Id,Title,FirstName,LastName,Email,Phone,Address,City,State,ZipCode&$orderby=Title asc&$top=500',
        companiesUrl: () => {
            return $.model._siteUrl + $.model.spCompaniesList
        },

        spContractsList: "/_api/web/lists/getbytitle('Contracts')/items",
        spContractsListArgs: '?$select=Id,Title,FirstName,LastName,Email,Phone&$orderby=Title asc&$top=500',
        contractsUrl: () => {
            return $.model._siteUrl + $.model.spContractsList
        },

        spContractPeriodList: "/_api/web/lists/getbytitle('Contract Period')/items",
        spContractPeriodListArgs: '?$select=Id,Title,ContractId,StartDate,EndDate,EPS,ContractNumber,PONumber,ITARS&$orderby=Title asc&$top=500',
        contractPeriodUrl: () => {
            return $.model._siteUrl + $.model.spContractPeriodList
        },

        spContractorsList: "/_api/web/lists/getbytitle('Contractors')/items",
        spContractorsListArgs: '?$select=Id,Title,LastName,WorkStatus,LaborCategoryId,CompanyId,Contracts&$orderby=LastName asc&$top=500',
        contractorsUrl: () => {
            return $.model._siteUrl + $.model.spContractorsList
        },

        spContractorDetailsList: "/_api/web/lists/getbytitle('Contractor Details')/items",
        spContractorDetailsListArgs: '?$select=Id,ContractorId,Title,Mobile,HomePhone,PlaceOfBirth,DateOfBirth,SSN,Address,City,State,ZipCode',
        contractorDetailsUrl: () => {
            return $.model._siteUrl + $.model.spContractorDetailsList
        },

        spGFEList: "/_api/web/lists/getbytitle('GFE')/items",
        spGFEListArgs: '?$select=Id,ContractorId,Title,EquipmentType,SerialNumber,VABarCode,EquipmentStatus,EquipmentValue,IssuingVAMC,PhysicalLocation,AnticipateReturn',
        gfeUrl: () => {
            return $.model._siteUrl + $.model.spGFEList
        },

        spOnboardingList: "/_api/web/lists/getbytitle('Onboarding')/items",
        spOnboardingListArgs: '?$select=Id,Title,ContractorId,InvestigationRequested,InvestigationType,InterviewDate,InvestigationCompleted,SACDate,TMSRequested,TMSUserId,TrainingCompleted,DomainAccount,DomainEmail,PIVRequested,PIVStatus,PIVIssued,PIVExpiration,NEMAAccount,eToken,CAG,GFERequested,Comments',
        onboardingUrl: () => {
            return $.model._siteUrl + $.model.spOnboardingList
        }
    });

    $.init = () => {
        $.dsLaborCategory = new kendo.data.DataSource({
            transport: {
                create: (options) => {
                    Lib.create((response) => {
                        options.success(response);
                    }, options, $.model.laborCategoryUrl());
                },
                read: (options) => {
                    Lib.read((response) => {
                        options.success(response);
                    }, $.model.laborCategoryUrl() + $.model.spLaborCategoryListArgs);
                },
                update: (options) => {
                    Lib.update(options, $.model.laborCategoryUrl());
                    options.success();
                },
                destroy: (options) => {
                    Lib.destroy(options, $.model.laborCategoryUrl());
                    options.success();
                }
            },
            pageSize: 5,
            schema: {
                model: {
                    id: 'Id',
                    fields: {
                        Id: { type: 'number' },
                        Title: { type: 'string' }
                    }
                }
            },
            error: (e) => {
                Utils.showMessage('Communication Error: dsLaborCategory', 'There was a communication error with SharePoint Online. Refresh your browser and try again. If the issue does not clear up, open a ticket with https://yourit.va.gov/va');
                console.log('dsLaborCategory', e);
            }
        });
        $.dsLaborCategory.fetch();

        $.dsCompanies = new kendo.data.DataSource({
            transport: {
                create: (options) => {
                    Lib.create((response) => {
                        options.success(response);
                    }, options, $.model.companiesUrl());
                },
                read: (options) => {
                    Lib.read((response) => {
                        options.success(response);
                    }, $.model.companiesUrl() + $.model.spCompaniesListArgs);
                },
                update: (options) => {
                    Lib.update(options, $.model.companiesUrl());
                    options.success();
                },
                destroy: (options) => {
                    Lib.destroy(options, $.model.companiesUrl());
                    options.success();
                }
            },
            pageSize: 5,
            schema: {
                model: {
                    id: 'Id',
                    fields: {
                        Id: { type: 'number' },
                        Title: { type: 'string' },
                        FirstName: { type: 'string' },
                        LastName: { type: 'string' },
                        Email: { type: 'string' },
                        Phone: { type: 'string' },
                        Address: { type: 'string' },
                        City: { type: 'string' },
                        State: { type: 'string' },
                        ZipCode: { type: 'string' }
                    }
                }
            },
            error: (e) => {
                Utils.showMessage('Communication Error: dsCompanies', 'There was a communication error with SharePoint Online. Refresh your browser and try again. If the issue does not clear up, open a ticket with https://yourit.va.gov/va');
                console.log('dsCompanies', e);
            }
        });
        $.dsCompanies.fetch();

        $.dsContracts = new kendo.data.DataSource({
            transport: {
                create: (options) => {
                    Lib.create((response) => {
                        options.success(response);
                    }, options, $.model.contractsUrl());
                },
                read: (options) => {
                    Lib.read((response) => {
                        options.success(response);
                    }, $.model.contractsUrl() + $.model.spContractsListArgs);
                },
                update: (options) => {
                    Lib.update(options, $.model.contractsUrl());
                    options.success();
                },
                destroy: (options) => {
                    Lib.destroy(options, $.model.contractsUrl());
                    options.success();
                }
            },
            pageSize: 5,
            schema: {
                model: {
                    id: 'Id',
                    fields: {
                        Id: { type: 'number' },
                        Title: { type: 'string' },
                        FirstName: { type: 'string' },
                        LastName: { type: 'string' },
                        Email: { type: 'string' },
                        Phone: { type: 'string' }
                    }
                }
            },
            error: (e) => {
                Utils.showMessage('Communication Error: dsContracts', 'There was a communication error with SharePoint Online. Refresh your browser and try again. If the issue does not clear up, open a ticket with https://yourit.va.gov/va');
                console.log('dsContracts', e);
            }
        });
        $.dsContracts.fetch();

        $.dsContractors = new kendo.data.DataSource({
            transport: {
                create: (options) => {
                    Lib.create((response) => {
                        options.success(response);
                                
                        // auto create details record
                        $.dsContractorDetails.add({ ContractorId: response.Id });
                        $.dsContractorDetails.sync();

                        // auto create onboarding record
                        $.dsOnboarding.add({ ContractorId: response.Id });
                        $.dsOnboarding.sync();
                    }, options, $.model.contractorsUrl());
                },
                read: (options) => {
                    Lib.read((response) => {
                        options.success(response);
                    }, $.model.contractorsUrl() + $.model.spContractorsListArgs);
                },
                update: (options) => {
                    Lib.update(options, $.model.contractorsUrl());
                    options.success();
                },
                destroy: (options) => {
                    Lib.destroy(options, $.model.contractorsUrl());
                    options.success();

                    // auto delete details record
                    let diContractorDetails = $.dsContractorDetails.data().find(e => e.ContractorId === options.data.Id);
                    $.dsContractorDetails.remove(diContractorDetails);
                    $.dsContractorDetails.sync();

                    // auto delete GFE records
                    $.each($.dsGFE.data().filter(e => e.ContractorId === options.data.Id), (index, value) => {
                        $.dsGFE.remove(value);
                    });
                    $.dsGFE.sync();

                    // auto delete onboarding record
                    let diOnboarding = $.dsOnboarding.data().find(e => e.ContractorId === options.data.Id);
                    $.dsOnboarding.remove(diOnboarding);
                    $.dsOnboarding.sync();
                }
            },
            pageSize: 5,
            schema: {
                model: {
                    id: 'Id',
                    fields: {
                        Id: { type: 'number' },
                        Title: { type: 'string' },
                        LastName: { type: 'string' },
                        WorkStatus: { type: 'string' },
                        LaborCategoryId: { type: 'number' },
                        CompanyId: { type: 'number' },
                        Contracts: { type: 'string' }
                    }
                }
            },
            error: (e) => {
                Utils.showMessage('Communication Error: dsContractors', 'There was a communication error with SharePoint Online. Refresh your browser and try again. If the issue does not clear up, open a ticket with https://yourit.va.gov/va');
                console.log('dsContractors', e);
            }
        });
        $.dsContractors.fetch();

        $.dsContractorDetails = new kendo.data.DataSource({
            transport: {
                create: (options) => {
                    Lib.create((response) => {
                        options.success(response);
                    }, options, $.model.contractorDetailsUrl());
                },
                read: (options) => {
                    Lib.read((response) => {
                        options.success(response);
                    }, $.model.contractorDetailsUrl() + $.model.spContractorDetailsListArgs);
                },
                update: (options) => {
                    Lib.update(options, $.model.contractorDetailsUrl());
                    options.success();
                },
                destroy: (options) => {
                    Lib.destroy(options, $.model.contractorDetailsUrl());
                    options.success();
                }
            },
            schema: {
                model: {
                    id: 'Id',
                    fields: {
                        ContractorId: { type: 'number' },
                        Title: { type: 'string' },
                        Mobile: { type: 'string' },
                        HomePhone: { type: 'string' },
                        PlaceOfBirth: { type: 'string' },
                        DateOfBirth: { type: 'date' },
                        SSN: { type: 'string' },
                        Address: { type: 'string' },
                        City: { type: 'string' },
                        State: { type: 'string' },
                        ZipCode: { type: 'string' }
                    }
                }
            },
            error: (e) => {
                Utils.showMessage('Communication Error: dsContractorDetails', 'There was a communication error with SharePoint Online. Refresh your browser and try again. If the issue does not clear up, open a ticket with https://yourit.va.gov/va');
                console.log('dsContractorDetails', e);
            }
        });
        $.dsContractorDetails.fetch();

        $.dsGFE = new kendo.data.DataSource({
            transport: {
                create: (options) => {
                    Lib.create((response) => {
                        options.success(response);
                    }, options, $.model.gfeUrl());
                },
                read: (options) => {
                    Lib.read((response) => {
                        options.success(response);
                    }, $.model.gfeUrl() + $.model.spGFEListArgs);
                },
                update: (options) => {
                    Lib.update(options, $.model.gfeUrl());
                    options.success();
                },
                destroy: (options) => {
                    Lib.destroy(options, $.model.gfeUrl());
                    options.success();
                }
            },
            schema: {
                model: {
                    id: 'Id',
                    fields: {
                        Id: { type: 'number' },
                        ContractorId: { type: 'number' },
                        Title: { type: 'string' },
                        EquipmentType: { type: 'string' },
                        SerialNumber: { type: 'string' },
                        VABarCode: { type: 'string' },
                        EquipmentStatus: { type: 'string' },
                        EquipmentValue: { type: 'number' },
                        IssuingVAMC: { type: 'string' },
                        PhysicalLocation: { type: 'string' },
                        AnticipateReturn: { type: 'date' }
                    }
                }
            },
            error: (e) => {
                Utils.showMessage('Communication Error: dsGFE', 'There was a communication error with SharePoint Online. Refresh your browser and try again. If the issue does not clear up, open a ticket with https://yourit.va.gov/va');
                console.log('dsGFE', e);
            }
        });
        $.dsGFE.fetch();

        $.dsOnboarding = new kendo.data.DataSource({
            transport: {
                create: (options) => {
                    Lib.create((response) => {
                        options.success(response);
                    }, options, $.model.onboardingUrl());
                },
                read: (options) => {
                    Lib.read((response) => {
                        options.success(response);
                    }, $.model.onboardingUrl() + $.model.spOnboardingListArgs);
                },
                update: (options) => {
                    Lib.update(options, $.model.onboardingUrl());
                    options.success();
                },
                destroy: (options) => {
                    Lib.destroy(options, $.model.onboardingUrl());
                    options.success();
                }
            },
            schema: {
                model: {
                    id: 'Id',
                    fields: {
                        Id: { type: 'number' },
                        Title: { type: 'string' },
                        ContractorId: { type: 'number' },
                        InvestigationRequested: { type: 'date' },
                        InvestigationType: { type: 'string' },
                        InterviewDate: { type: 'date' },
                        InvestigationCompleted: { type: 'date' },
                        SACDate: { type: 'date' },
                        TMSRequested: { type: 'date' },
                        TMSUserId: { type: 'string' },
                        TrainingCompleted: { type: 'date' },
                        DomainAccount: { type: 'string' },
                        DomainEmail: { type: 'string' },
                        PIVRequested: { type: 'date' },
                        PIVStatus: { type: 'string' },
                        PIVIssued: { type: 'date' },
                        PIVExpiration: { type: 'date' },
                        NEMAAccount: { type: 'boolean' },
                        eToken: { type: 'boolean' },
                        CAG: { type: 'boolean' },
                        GFERequested: { type: 'boolean' },
                        Comments: { type: 'string' },
                    }
                }
            },
            error: (e) => {
                Utils.showMessage('Communication Error: dsOnboarding', 'There was a communication error with SharePoint Online. Refresh your browser and try again. If the issue does not clear up, open a ticket with https://yourit.va.gov/va');
                console.log('dsOnboarding', e);
            }
        });
        $.dsOnboarding.fetch();
    }

    $.render = () => {
        // timeout alert set for 15 min
        setTimeout(() => {
            Utils.showMessage('SharePoint Session Timeout','Your session has timed out. Any attempt to update information will result in an error. Please reload your web page to continue working.');
        }, 900000);

        $("#toolbar").kendoToolBar({
            items: [
                { template: "<label for='title-dropdown'>Contract: </label>" },
                { template: "<input id='title-dropdown' style='width: 350px;' />", overflow: "never" },
                { type: "separator" },
                { template: "<div style='min-width:60vw;'></div>" },
                { type: "button", text: "Companies", overflow: "always" },
                { type: "button", text: "Contracts", overflow: "always" },
                { type: "button", text: "Labor Categories", overflow: "always" },
            ],

            // Events
            click: Events.onToolbarClick
        });

        $('#gridLaborCategory').kendoGrid({
            dataSource: $.dsLaborCategory,

            // options
            editable: 'inline',
            pageable: true,
            sortable: true,
            toolbar: [ 'create', 'search' ],

            columns: [
                { field: 'Title', title: 'Labor Category' },
                { command: [ 'edit', 'destroy' ], title: ' ', width: 300 }
            ]
        });

        $('#gridCompany').kendoGrid({
            dataSource: $.dsCompanies,

            // options
            editable: 'popup',
            pageable: true,
            scrollable: { column: 'virtual' },
            sortable: true,
            toolbar: [ 'create', 'search' ],

            columns: [
                { command: [ 'edit', 'destroy' ], title: ' ', width: 300 },
                { field: 'Title', title: 'Company Name', width: 300 },
                { field: 'FirstName', title: 'First Name', hidden: true },
                { field: 'LastName', title: 'Last Name', hidden: true },
                { field: 'Email', title: 'Email', template: '<a href="mailto:#= Email #" title="Send mail to #= FirstName # #= LastName #">#= LastName #, #= FirstName #</a>', width: 200, editor: Editors.email },
                { field: 'Phone', title: 'Phone', width: 150, editor: Editors.phone },
                { field: 'Address', title: 'Address', width: 300 },
                { field: 'City', title: 'City', width: 200 },
                { field: 'State', title: 'State', width: 100, editor: Editors.state },
                { field: 'ZipCode', title: 'Zip Code', width: 100, editor: Editors.zipcode }                
            ]
        });

        $('#gridContracts').kendoGrid({
            dataSource: $.dsContracts,

            // options
            editable: 'popup',
            pageable: true,
            sortable: true,
            toolbar: [ 'create', 'search' ],

            columns: [
                { command: [ 'edit', 'destroy' ], title: ' ', width: 250 },
                { field: 'Title', title: 'Contract Name' },
                { field: 'FirstName', title: 'First Name', hidden: true },
                { field: 'LastName', title: 'Last Name', hidden: true },
                { field: 'Email', title: 'Email', template: '<a href="mailto:#= Email #" title="Send mail to #= FirstName # #= LastName #">#= LastName #, #= FirstName #</a>', width: 250, editor: Editors.email },
                { field: 'Phone', title: 'Phone', width: 150, editor: Editors.phone }              
            ],

            detailInit: Events.contractDetails
        });

        $('#gridMain').kendoGrid({
            dataSource: $.dsContractors,

            // options
            detailTemplate: kendo.template($('#template').html()),
            editable: 'popup',
            pageable: true,
            sortable: true,
            toolbar: [ 'create', 'search' ],

            columns: [
                { command: [ 'edit', 'destroy' ], title: ' ', width: 250 },
                { field: 'Title', title: 'First Name' },
                { field: 'LastName', title: 'Last Name' },
                { field: 'LaborCategoryId', title: 'Labor Category', editor: Editors.laborCategory, width: 250, template: (item) => { if (item.LaborCategoryId !== undefined && item.LaborCategoryId !== 0) return $.dsLaborCategory.get(item.LaborCategoryId).Title; } },
                { field: 'CompanyId', title: 'Company', editor: Editors.company, width: 250, template: (item) => { if (item.CompanyId !== undefined && item.CompanyId !== 0) return $.dsCompanies.get(item.CompanyId).Title; } },
                { field: 'Contracts', title: 'Contracts', editor: Editors.contracts, width: 200, hidden: true },
                { field: 'WorkStatus', title: 'Work Status', editor: Editors.workStatus, width: 200 }
            ],

            detailInit: Events.contractorAllDetails,
            save: (e) => {
                e.model.Contracts = e.model.Contracts.toString();

            }
        });

        $('#title-dropdown').kendoDropDownList({
            autoBind: false,
            dataSource: $.dsContracts,
            dataTextField: 'Title',
            dataValueField: 'Id',
            optionLabel: {
                Title: 'View all contracts...',
                Id: 0
            },

            select: Events.onContractSelect
        })
    }

    Lib = {
        create: (callback, args, url) => {
            Utils.getDigest();
            $.ajax({
                url: url,
                method: 'POST',
                data: JSON.stringify(Utils.cleanseModel(args.data)),
                headers: {
                    'Accept': 'application/json;odata=nometadata',
                    'Content-Type': 'application/json;odata=nometadata',
                    'X-RequestDigest': $.model._digest,
                    'X-HTTP-Method': 'POST'
                }
            })
            .done((response) => {
                callback(response);
            })
            .fail((response) => {
                console.log('fail', response);
                Utils.showMessage('Communication Error', 'There was a communication error with SharePoint Online. Refresh your browser and try again. If the issue does not clear up, open a ticket with https://yourit.va.gov/va');
            })
            .always((response) => {
                //console.log('always', response);
            })
        },
        read: (callback, url) => {
            $.ajax({
                url: url,
                dataType: 'json',
                type: 'GET',
                async: true,
                headers: {
                    'Accept': 'application/json;odata=nometadata',
                    'Content-Type': 'application/json;odata=nometadata'
                }
            })
            .done((response) => {
                callback(response.value);
            })
            .fail((response) => {
                console.log('fail', response);
            })
            .always(() => {
                //console.log('always');
            })
        },
        update: (args, url) => {
            Utils.getDigest();
            $.ajax({
                url: url + '(' + args.data.Id + ')',
                method: 'PATCH',
                data: JSON.stringify(Utils.cleanseModel(args.data)),
                headers: {
                    'Accept': 'application/json;odata=nometadata',
                    'Content-Type': 'application/json;odata=nometadata',
                    'X-RequestDigest': $.model._digest,
                    'IF-MATCH': '*',
                    'X-HTTP-Method': 'PATCH'
                }
            })
            .done((response) => {
                console.log('done', response);
            })
            .fail((response) => {
                console.log('fail', response);
                Utils.showMessage('Communication Error', 'There was a communication error with SharePoint Online. Refresh your browser and try again. If the issue does not clear up, open a ticket with https://yourit.va.gov/va');
            })
            .always(() => {
                //console.log('always');
            })
        },
        destroy: (args, url) => {
            Utils.getDigest();
            $.ajax({  
                url: url + '(' + args.data.Id + ')',
                method: 'POST',  
                headers: {  
                    'Accept': 'application/json;odata=nometadata',
                    'Content-Type': 'application/json;odata=nometadata',
                    'X-RequestDigest': $.model._digest,
                    'IF-MATCH': '*',
                    'X-HTTP-Method': 'DELETE'
                }
            })
            .done((response) => {
                console.log(response);
            })
            .fail((response) => {
                console.log('fail', response);
                Utils.showMessage('Communication Error', 'There was a communication error with SharePoint Online. Refresh your browser and try again. If the issue does not clear up, open a ticket with https://yourit.va.gov/va');
            })
            .always(() => {
                //console.log('always');
            })
        }
    }

    // internal utility functions
    Utils = {
        showMessage: (title, message) => {
            var displayMessage = $('#message').data('kendoWindow');
            displayMessage.title(title);
            displayMessage.content(message);
            displayMessage.open();
        },
        getDigest: () => {
            $.ajax({
                url:  vaApp.model._siteUrl + '/_api/contextinfo',
                dataType: 'json',
                type: 'POST',
                async: true,
                headers: {
                    'Accept': 'application/json;odata=verbose',
                    'Content-Type': 'application/json;odata=verbose'
                },
                success: function (response) {
                    $.model.set('_digest', response.d.GetContextWebInformation.FormDigestValue);
                },
                error: function (xhr) {
                    Utils.showMessage('Error: Digest Request Failure','There was a communication error with SharePoint obtaining the request digest needed for POST operations. See the console log for more details...');
                    console.log(xhr);
                }
            });
        },
        cleanseModel: (model) => {
            delete model['__kendo_devtools_id'];
            return model;
        }
    }

    Events = {
        contractorAllDetails: (e) => {
            // get current item id
            let id = e.data.Id;

            e.detailRow.find('#tabstrip').kendoTabStrip();

            e.detailRow.find('#gridOnboarding').kendoGrid({
                dataSource: {
                    autoSync: true,
                    transport: {
                        create: (options) => {
                            Lib.create((response) => {
                                options.success(response);
                            }, options, $.model.onboardingUrl());
                        },
                        read: (options) => {
                            Lib.read((response) => {
                                options.success(response);
                            }, $.model.onboardingUrl() + $.model.spOnboardingListArgs);
                        },
                        update: (options) => {
                            Lib.update(options, $.model.onboardingUrl());
                            options.success();
                        },
                        destroy: (options) => {
                            Lib.destroy(options, $.model.onboardingUrl());
                            options.success();
                        }
                    },
                    schema: {
                        model: {
                            id: 'Id',
                            fields: {
                                Id: { type: 'number' },
                                Title: { type: 'string' },
                                ContractorId: { type: 'number' },
                                InvestigationRequested: { type: 'date' },
                                InvestigationType: { type: 'string' },
                                InterviewDate: { type: 'date' },
                                InvestigationCompleted: { type: 'date' },
                                SACDate: { type: 'date' },
                                TMSRequested: { type: 'date' },
                                TMSUserId: { type: 'string' },
                                TrainingCompleted: { type: 'date' },
                                DomainAccount: { type: 'string' },
                                DomainEmail: { type: 'string' },
                                PIVRequested: { type: 'date' },
                                PIVStatus: { type: 'string' },
                                PIVIssued: { type: 'date' },
                                PIVExpiration: { type: 'date' },
                                NEMAAccount: { type: 'boolean' },
                                eToken: { type: 'boolean' },
                                CAG: { type: 'boolean' },
                                GFERequested: { type: 'boolean' },
                                Comments: { type: 'string' },
                            }
                        }
                    },
                    error: (e) => {
                        Utils.showMessage('Communication Error: dsOnboarding', 'There was a communication error with SharePoint Online. Refresh your browser and try again. If the issue does not clear up, open a ticket with https://yourit.va.gov/va');
                        console.log('dsOnboarding', e);
                    }
                },
                editable: 'incell',
                resizable: true,
                scrollable: { virtual: 'columns' },
                columns: [
                    { field: 'GFERequested', title: 'GFE Requested', template: '#= GFERequested ? "Yes" : "No" #', width: 150 },
                    { title: 'Background Investigation', 
                        columns: [
                            { field: 'InvestigationRequested', title: 'Date Requested', width: 150, template: '#= kendo.toString(kendo.parseDate(InvestigationRequested), "MMM d, yyyy") #' },
                            { field: 'InvestigationType', title: 'Type', width: 125 },
                            { field: 'InterviewDate', title: 'Interview Date', width: 150, template: '#= kendo.toString(kendo.parseDate(InterviewDate), "MMM d, yyyy") #' },
                            { field: 'InvestigationCompleted', title: 'Completed Date', width: 150, template: '#= kendo.toString(kendo.parseDate(InvestigationCompleted), "MMM d, yyyy") #' },
                            { field: 'SACDate', title: 'SAC Date', width: 150, template: '#= kendo.toString(kendo.parseDate(SACDate), "MMM d, yyyy") #' },
                        ]
                    },
                    { title: 'TMS Information',
                        columns: [
                            { field: 'TMSRequested', title: 'Date Requested', template: '#= kendo.toString(TMSRequested, "M/d/yyyy") #', width: 150 },
                            { field: 'TMSUserId', title: 'User ID', width: 250 },
                            { field: 'TrainingCompleted', title: 'Training Completed', template: '#= kendo.toString(TrainingCompleted, "M/d/yyyy") #', width: 175 }
                        ]
                    },
                    { title: 'Active Directory',
                        columns: [
                            { field: 'DomainAccount', title: 'Domain Account', width: 175 },
                            { field: 'DomainEmail', title: 'VA Email', width: 300 }
                        ]
                    },
                    { title: 'PIV Information',
                        columns: [
                            { field: 'PIVRequested', title: 'Date Requested', template: '#= kendo.toString(PIVRequested, "M/d/yyyy") #', width: 150 },
                            { field: 'PIVStatus', title: 'Request Status', width: 150, editor: Editors.pivStatus },
                            { field: 'PIVIssued', title: 'Issued Date', template: '#= kendo.toString(PIVIssued, "M/d/yyyy") #', width: 150 },
                            { field: 'PIVExpiration', title: 'Expiration Date', template: '#= kendo.toString(PIVExpiration, "M/d/yyyy") #', width: 150 }
                        ]
                    },
                    { title: 'Elevated Permissions',
                        columns: [
                            { field: 'NEMAAccount', title: 'NEMA Account', template: '#= NEMAAccount ? "Yes" : "No" #', width: 150 },
                            { field: 'eToken', title: 'eToken Issued', template: '#= eToken ? "Yes" : "No" #', width: 150 }
                        ]
                    },
                    { title: 'Remote Access',
                        columns: [
                            { field: 'CAG', title: 'CAG', template: '#= CAG ? "Yes" : "No" #', width: 200 }
                        ]
                    },
                    { field: 'Comments', title: 'Comments', width: 500, editor: Editors.textEditor }

                ]
            });

            e.detailRow.find('#gridGFE').kendoGrid({
                dataSource: {
                    transport: {
                        create: (options) => {
                            console.log('options', options);
                            Lib.create((response) => {
                                options.success(response);
                            }, options, $.model.gfeUrl());
                        },
                        read: (options) => {
                            Lib.read((response) => {
                                options.success(response);
                            }, $.model.gfeUrl() + $.model.spGFEListArgs);
                        },
                        update: (options) => {
                            Lib.update(options, $.model.gfeUrl());
                            options.success();
                        },
                        destroy: (options) => {
                            Lib.destroy(options, $.model.gfeUrl());
                            options.success();
                        }
                    },
                    filter: { field: 'ContractorId', operator: 'eq', value: id },
                    schema: {
                        model: {
                            id: 'Id',
                            fields: {
                                Id: { type: 'number' },
                                ContractorId: { type: 'number' },
                                Title: { type: 'string' },
                                EquipmentType: { type: 'string' },
                                SerialNumber: { type: 'string' },
                                VABarCode: { type: 'string' },
                                EquipmentStatus: { type: 'string' },
                                EquipmentValue: { type: 'number' },
                                IssuingVAMC: { type: 'string' },
                                PhysicalLocation: { type: 'string' },
                                AnticipateReturn: { type: 'date' }
                            }
                        }
                    },
                    error: (e) => {
                        Utils.showMessage('Communication Error: dsGFE', 'There was a communication error with SharePoint Online. Refresh your browser and try again. If the issue does not clear up, open a ticket with https://yourit.va.gov/va');
                        console.log('dsGFE', e);
                    }
                },
                editable: 'popup',
                scrollable: { virtual: 'columns' },
                toolbar: [ 'create' ],
                columns: [
                    { command: [ 'edit', 'destroy' ], title: ' ', width: 250 },
                    { field: 'Title', title: 'Make & Model', width: 200 },
                    { field: 'EquipmentType', title: 'Type', width: 200, editor: Editors.equipmentType },
                    { field: 'SerialNumber', title: 'Serial #', width: 150 },
                    { field: 'VABarCode', title: 'VA Barcode', width: 150 },
                    { field: 'EquipmentStatus', title: 'Status', width: 200, editor: Editors.equipmentStatus },
                    { field: 'EquipmentValue', title: 'Value', width: 200, format: '{0:c}' },
                    { field: 'IssuingVAMC', title: 'Issuing VAMC', width: 200 },
                    { field: 'PhysicalLocation', title: 'Equipment Location', width: 250 },
                    { field: 'AnticipateReturn', title: 'Anticipated Return', width: 150, template: '#= kendo.toString(kendo.parseDate(AnticipateReturn), "MMM d, yyyy") #' }
                ],

                edit: (e) => { 
                    // set ContractId if new record
                    if (e.model.isNew()) e.model.ContractorId = id;
                }
            });

            e.detailRow.find('#gridContractorDetails').kendoGrid({
                dataSource: {
                    transport: {
                        create: (options) => {
                            Lib.create((response) => {
                                options.success(response);
                            }, options, $.model.contractorDetailsUrl());
                        },
                        read: (options) => {
                            Lib.read((response) => {
                                options.success(response);
                            }, $.model.contractorDetailsUrl() + $.model.spContractorDetailsListArgs);
                        },
                        update: (options) => {
                            Lib.update(options, $.model.contractorDetailsUrl());
                            options.success();
                        },
                        destroy: (options) => {
                            Lib.destroy(options, $.model.contractorDetailsUrl());
                            options.success();
                        }
                    },
                    filter: { field: 'ContractorId', operator: 'eq', value: id },
                    schema: {
                        model: {
                            id: 'Id',
                            fields: {
                                ContractorId: { type: 'number' },
                                Title: { type: 'string' },
                                Mobile: { type: 'string' },
                                HomePhone: { type: 'string' },
                                PlaceOfBirth: { type: 'string' },
                                DateOfBirth: { type: 'date' },
                                SSN: { type: 'string' },
                                Address: { type: 'string' },
                                City: { type: 'string' },
                                State: { type: 'string' },
                                ZipCode: { type: 'string' }
                            }
                        }
                    },
                    error: (e) => {
                        Utils.showMessage('Communication Error: dsContractorDetails', 'There was a communication error with SharePoint Online. Refresh your browser and try again. If the issue does not clear up, open a ticket with https://yourit.va.gov/va');
                        console.log('dsContractorDetails', e);
                    }
                },
                editable: 'popup',
                scrollable: { virtual: 'columns' },
                columns: [
                    { command: [ 'edit' ], title: ' ', width: 150 },
                    { field: 'Title', title: 'Personal Email', width: 250, editor: Editors.email },
                    { field: 'Mobile', title: 'Mobile', width: 150, editor: Editors.phone },
                    { field: 'HomePhone', title: 'Home Phone', width: 150, editor: Editors.phone },
                    { field: 'PlaceOfBirth', title: 'Place of Birth', width: 250 },
                    { field: 'DateOfBirth', title: 'Date of Birth', width: 150, template: '#= kendo.toString(kendo.parseDate(DateOfBirth), "MMM d, yyyy") #' },
                    { field: 'SSN', title: 'SSN', width: 150, editor: Editors.ssn },
                    { field: 'Address', title: 'Address', width: 300 },
                    { field: 'City', title: 'City', width: 175 },
                    { field: 'State', title: 'State', width: 125, editor: Editors.state },
                    { field: 'ZipCode', title: 'ZipCode', width: 125, editor: Editors.zipcode },
                ]
            });
        },
        contractDetails: (e) => {
            $("<div/>").appendTo(e.detailCell).kendoGrid({
                dataSource: {
                    transport: {
                        create: (options) => {
                            Lib.create((response) => {
                                options.success(response);
                            }, options, $.model.contractPeriodUrl());
                        },
                        read: (options) => {
                            Lib.read((response) => {
                                options.success(response);
                            }, $.model.contractPeriodUrl() + $.model.spContractPeriodListArgs);
                        },
                        update: (options) => {
                            Lib.update(options, $.model.contractPeriodUrl());
                            options.success();
                        },
                        destroy: (options) => {
                            Lib.destroy(options, $.model.contractPeriodUrl());
                            options.success();
                        }
                    },
                    filter: { field: 'ContractId', operator: 'eq', value: e.data.Id },
                    pageSize: 5,
                    schema: {
                        model: {
                            id: 'Id',
                            fields: {
                                Id: { type: 'number' },
                                Title: { type: 'string' },
                                ContractId: { type: 'number' },
                                StartDate: { type: 'date' },
                                EndDate: { type: 'date' },
                                EPS: { type: 'string' },
                                ContractNumber: { type: 'string' },
                                PONumber: { type: 'string' },
                                ITARS: { type: 'string' },
                            }
                        }
                    },
                    error: (e) => {
                        Utils.showMessage('Communication Error: dsContractPeriod', 'There was a communication error with SharePoint Online. Refresh your browser and try again. If the issue does not clear up, open a ticket with https://yourit.va.gov/va');
                        console.log('dsContractPeriod', e);
                    }
                },
                editable: 'popup',
                sortable: true,
                scrollable: { virtual: 'columns' },
                toolbar: [ 'create' ],
                columns: [
                    { command: [ 'edit', 'destroy' ], title: ' ', width: 250 },
                    { field: 'Title', title: 'Period', editor: Editors.period, width: 150 },
                    { field: 'StartDate', title: 'Start Date', template: (data) => { return kendo.toString(kendo.parseDate(data.StartDate), "MMM d, yyyy") }, width: 150 },
                    { field: 'EndDate', title: 'End Date', template: (data) => { return kendo.toString(kendo.parseDate(data.EndDate), "MMM d, yyyy") }, width: 150 },
                    { field: 'EPS', title: 'EPS Number', width: 200},
                    { field: 'ContractNumber', title: 'Contract Number', width: 200 },
                    { field: 'PONumber', title: 'PO Number', width: 200 },
                    { field: 'ITARS', title: 'ITARS', width: 125 }
                ],

                save: (e) => {
                    // set ContractId if new record
                    if (e.model.isNew()) e.model.ContractId = $('#gridContracts').data('kendoGrid').dataItem(e.sender.element.closest("tr").prev()).Id
                }
            });
            
        },
        onContractSelect: (e) => {
            $('#content').children('div :not(:first)').hide();
            $('#content').children('div :first').show();

            if ( e.dataItem.Id === 0 ) $.dsContractors.filter({});
            else $.dsContractors.filter({ field: 'Contracts', operator: 'contains', value: e.dataItem.Id });
        },
        onToolbarClick: (e) => {
            // Hide all children divs
            $('#content').children('div').hide();

            // Show selected div
            switch (e.item.options.text)
            {
                case 'Companies':
                    $($('#content').children('div')[1]).show();
                    break;
                case 'Contracts':
                    $($('#content').children('div')[2]).show();
                    break;
                case 'Labor Categories':
                    $($('#content').children('div')[3]).show();
                    break;
                default:
                    // no default behavior
            }

            $('#title-dropdown').data('kendoDropDownList').select(0);
            $('#title-dropdown').data('kendoDropDownList').trigger('change');
        }
    }

    Editors = {
        phone: (container, options) => {
            $('<input name="' + options.field + '" class="k-input k-textbox"/>').appendTo(container).mask('(000) 000-0000');
        },
        ssn: (container, options) => {
            $('<input name="' + options.field + '" class="k-input k-textbox"/>').appendTo(container).mask('000-00-0000');
        },
        zipcode: (container, options) => {
            $('<input name="' + options.field + '" class="k-input k-textbox"/>').appendTo(container).mask('00000-0000');
        },
        state: (container, options) => {
            $('<input name="' + options.field + '" class="k-input k-textbox"/>').appendTo(container).mask('SS', { 'translation': { S: { pattern: /[A-Z]/ } } });
        },
        email: (container, options) => {
            $('<input name="' + options.field + '" class="k-input k-textbox"/>').appendTo(container).mask('A', { 'translation': { A: { pattern: /[\w@\-.+]/, recursive: true } } });
        },
        period: (container, options) => {
            $('<input required name="' + options.field + '"/>')
            .appendTo(container)
            .kendoDropDownList({
                autoBind: true,
                dataSource: { data: Lookup.period }
            });
        },
        laborCategory: (container, options) => {
            $('<input required name="' + options.field + '"/>')
            .appendTo(container)
            .kendoDropDownList({
                autoBind: true,
                dataSource: $.dsLaborCategory,
                dataTextField: 'Title',
                dataValueField: 'Id'
            });
        },
        company: (container, options) => {
            $('<input required name="' + options.field + '"/>')
            .appendTo(container)
            .kendoDropDownList({
                autoBind: true,
                dataSource: $.dsCompanies,
                dataTextField: 'Title',
                dataValueField: 'Id'
            });
        },
        contracts: (container, options) => {
            options.model.Contracts = JSON.parse("[" + options.model.Contracts + "]");
            $('<select required multiple name="' + options.field + '"/>')
            .appendTo(container)
            .kendoMultiSelect({
                autoBind: true,
                valuePrimitive: true,
                dataSource: $.dsContracts,
                dataTextField: 'Title',
                dataValueField: 'Id'
            });
        },
        workStatus: (container, options) => {
            $('<input required name="' + options.field + '"/>')
            .appendTo(container)
            .kendoDropDownList({
                autoBind: true,
                dataSource: { data: Lookup.workStatus }
            });
        },
        equipmentType: (container, options) => {
            $('<input required name="' + options.field + '"/>')
            .appendTo(container)
            .kendoDropDownList({
                autoBind: true,
                dataSource: { data: Lookup.equipmentType }
            });
        },
        equipmentStatus: (container, options) => {
            $('<input required name="' + options.field + '"/>')
            .appendTo(container)
            .kendoDropDownList({
                autoBind: true,
                dataSource: { data: Lookup.equipmentStatus }
            });
        },
        pivStatus: (container, options) => {
            $('<input name="' + options.field + '"/>')
            .appendTo(container)
            .kendoDropDownList({
                autoBind: true,
                dataSource: { data: Lookup.pivStatus }
            });
        },
        textEditor: (container, options) => {
            $('<textarea name="' + options.field + '"/>')
            .appendTo(container)
            .kendoEditor({
                tools: []
            });
        }
    }
} (window.vaApp = window.vaApp = window.$ || {}, jQuery));

kendo.ui.progress($('#gridMain'), true);

$.init();
// allow the data sources to load to avoid template errors in the grid
setTimeout(() => {
    $.render();
    kendo.ui.progress($('#gridMain'), false);
}, 3000);

$('#content').children('div :not(:first)').hide();
$('#details').hide();