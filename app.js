/// <reference path="node_modules/@types/jquery/index.d.ts" />
/// <reference path="node_modules/@types/faker/index.d.ts" />
/// <reference path="node_modules/@progress/kendo-ui/index.d.ts" />

(function (vaApp, $, undefined) {
    let Lookup = {
        contracts: ['Tools Contract FY20 - FY24','Open Source Contract FY20 - FY24','Methodology Contract FY20 - FY24'],
        contractTitle: [],
        equipmentStatus: ['In Service','Returned','Other'],
        equipmentType: ['Laptop','Monitor','Other'],
        period: ['Base Year','Option Year 1','Option Year 2','Option Year 3','Option Year 4'],
        status: ['Issued','Processing','Submitted','Revoked'],
        workstatus: ['In Progress','Onboarded','Offboarded'],
        random: (array) => { return array[Math.floor(Math.random() * array.length)]; }
    }

    $.model = new kendo.observable({
        // random data arrays
        companies: [],
        contract: [],
        contractPeriod: [],
        contractor: [],
        gfe: [],
        lcat: [],
        onboarding: []
    });

    $.init = () => {
        var counter = 0;
        // generate contract
        for (var i=0; i < 3; i++) {
            $.model.contract.push({
                id: i,
                title: Lookup.contracts[i],
                corfirst: faker.name.firstName(),
                corlast: faker.name.lastName(),
                corphone: faker.phone.phoneNumberFormat(1)
            });
            $.model.contract[i].coremail = $.model.contract[i].corfirst + '.' + $.model.contract[i].corlast + '@va.gov';

            for (var j=0; j < 5; j++) {
                $.model.contractPeriod.push({
                    id: counter++,
                    contractid: i,
                    period: Lookup.period[j],
                    startdate: new Date(2020 + j,0,1),
                    enddate: new Date(2020 + j,11,31),
                    eps: faker.helpers.replaceSymbols('?##-?###-#???-#??#'),
                    cnumber: faker.helpers.replaceSymbols('##??##??######'),
                    ponumber: 'PO' + faker.helpers.replaceSymbols('####-########-#'),
                });
            }                
        }
        $.dsContract = new kendo.data.DataSource({
            transport: {
                read: function (options) {
                    options.success($.model.contract)
                },
                create: function (options) {
                    options.success()
                },
                update: function (options) {
                    options.success()
                },
                destroy: function (options) {
                    options.success()
                }
            },
            pageSize: 5,
            schema: {
                model: {
                    id: 'id',
                    fields: {
                        title: { type: 'string' },
                        corfirst: { type: 'string' },
                        corlast: { type: 'string' },
                        corphone: { type: 'string' },
                        coremail: { type: 'string' }
                    }
                }
            }
        });
        $.dsContractPeriod = new kendo.data.DataSource({
            transport: {
                read: function (options) {
                    options.success($.model.contractPeriod)
                },
                create: function (options) {
                    options.success()
                },
                update: function (options) {
                    options.success()
                },
                destroy: function (options) {
                    options.success()
                }
            },
            pageSize: 5,
            schema: {
                model: {
                    id: 'id',
                    fields: {
                        contractid: { type: 'number' },
                        period: { type: 'string' },
                        startdate: { type: 'date' },
                        enddate: { type: 'date' },
                        eps: { type: 'string' },
                        cnumber: { type: 'string' },
                        ponumber: { type: 'string' }
                    }
                }
            }
        });


        Lookup.contractTitle = [...new Set($.model.contract.map(x => x.title))];

        // generate lcat
        for (var i=0; i < 10; i++) {
            $.model.lcat.push({
                id: i,
                jobtitle: faker.name.jobTitle()
            })
        }
        $.dsLCATs = new kendo.data.DataSource({
            transport: {
                read: function (options) {
                    options.success($.model.lcat)
                },
                create: function (options) {
                    options.success()
                },
                update: function (options) {
                    options.success()
                },
                destroy: function (options) {
                    options.success()
                }
            },
            pageSize: 5,
            schema: {
                model: {
                    id: 'id',
                    fields: {
                        jobtitle: { type: 'string' }
                    }
                }
            }
        });

        // generate companies
        for (var i=0; i < 5; i++)
        {
            $.model.companies.push({
                id: i,
                companyname: faker.company.companyName(),
                firstname: faker.name.firstName(),
                lastname:  faker.name.lastName(),
                contactphone: faker.helpers.replaceSymbols('###-###-####'),
                address: faker.address.streetAddress(),
                city: faker.address.city(),
                state: faker.address.state(),
                zip: faker.address.zipCode()
            });
            $.model.companies[i].contactemail = $.model.companies[i].firstname + '.' + $.model.companies[i].lastname + '@' + $.model.companies[i].companyname.replace(/[ ,-]/g, '') + '.com';
        };
        $.dsCompanies = new kendo.data.DataSource({
            transport: {
                read: function (options) {
                    options.success($.model.companies)
                },
                create: function (options) {
                    options.success()
                },
                update: function (options) {
                    options.success()
                },
                destroy: function (options) {
                    options.success()
                }
            },
            pageSize: 5,
            schema: {
                model: {
                    id: 'id',
                    fields: {
                        companyname: { type: 'string' },
                        firstname: { type: 'string' },
                        lastname: { type: 'string' },
                        contactphone: { type: 'string' },
                        contactemail: { type: 'string' },
                        address: { type: 'string' },
                        city: { type: 'string' },
                        state: { type: 'string' },
                        zip: { type: 'string' }
                    }
                }
            }
        });

        // generate contractors, onboarding & gfe
        for (var i=0; i < 50; i++) {
            $.model.contractor.push({
                id: i,
                firstname: faker.name.firstName(),
                lastname:  faker.name.lastName(),
                pob: faker.address.city() + ', ' + faker.address.state(),
                jobtitle: $.model.lcat[faker.random.number({min:0, max:9})].jobtitle,
                dob: faker.date.between('1960-01-01','2000-12-31'),
                ssn: faker.phone.phoneNumber('###-##-####'),
                company: $.model.companies[faker.random.number({min:0, max:4})].companyname,
                address: faker.address.streetAddress(),
                city: faker.address.city(),
                state: faker.address.state(),
                zip: faker.address.zipCode(),
                homephone: faker.phone.phoneNumberFormat(1),
                mobile: faker.phone.phoneNumberFormat(1)
            });
            //$.model.contractor[i].contactorEmail = $.model.contractor[i].firstname + '.' + $.model.contractor[i].lastname + '@' + $.model.company[$.model.contractor[i].company].companyname.replace(/[ ,-]/g, '') + '.com';
            //$.model.contractor[i].vaemail = $.model.contractor[i].firstname + '.' + $.model.contractor[i].lastname + '@va.gov';
            //$.model.contractor[i].samaccount = 'vhaxxx' + $.model.contractor[i].lastname.substring(5) + $.model.contractor[i].firstname.substring(1);
            $.model.contractor[i].personalemail = $.model.contractor[i].firstname + '.' + $.model.contractor[i].lastname + '@' + faker.internet.email().split('@')[1];

            $.model.onboarding.push({
                id: i,
                contractorid: i,
                contractPeriod: Array.from({length:Math.ceil(Math.random() * 5)}, (v, i) => Lookup.period[i]),
                status: Lookup.random(Lookup.workstatus),
                biSubmitDate: faker.date.between('2019-01-01','2019-12-31'),
                sacVerified: faker.date.between('2019-01-01','2019-12-31'),
                biRequest: faker.date.between('2019-01-01','2019-12-31'),
                biType: faker.lorem.word(),
                interview: faker.date.between('2019-01-01','2019-12-31'),
                tmsRequest: faker.date.between('2019-01-01','2019-12-31'),
                tmsUserId: $.model.contractor[i].firstname + '.' + $.model.contractor[i].lastname + faker.phone.phoneNumber('####'),
                trainingCompleted: faker.date.between('2019-01-01','2019-12-31'),
                domainAccount: 'vhaxxx' + $.model.contractor[i].lastname.toLowerCase().substring(0,5) + $.model.contractor[i].firstname.toLowerCase().substring(0,1),
                domainEmail: $.model.contractor[i].firstname + '.' + $.model.contractor[i].lastname + '@va.gov',
                pivRequest: faker.date.between('2019-01-01','2019-12-31'),
                pivStatus: Lookup.random(Lookup.status),
                pivIssuedDate: faker.date.between('2019-01-01','2019-12-31'),
                pivExpiration: faker.date.between('2022-01-01','2022-12-31'),
                nemaAccount: faker.random.boolean(),
                eToken: faker.random.boolean(),
                cag: faker.random.boolean(),
                comments: faker.lorem.paragraphs()
            });
            $.model.gfe.push({
                id: i,
                contractorid: i,
                status: Lookup.random(Lookup.equipmentStatus),
                type: Lookup.equipmentType[0],
                makeModel: 'Dell Latitude E5490',
                serialNumber: faker.helpers.replaceSymbols('???####??#'),
                vaBarCode: faker.helpers.replaceSymbols('###EE#####'),
                value: 1500,
                issuingVAMC: 'VAMC',
                anticipateReturn: new Date(2020,8,25),
                physicalLocation: faker.address.city() + ', ' + faker.address.state()
            });
            if ($.model.gfe[i].status === 'Returned') $.model.gfe[i].anticipateReturn = new Date();
        };
        $.dsContractor = new kendo.data.DataSource({
            transport: {
                read: function (options) {
                    options.success($.model.contractor)
                },
                create: function (options) {
                    options.success()
                },
                update: function (options) {
                    options.success()
                },
                destroy: function (options) {
                    options.success()
                }
            },
            pageSize: 5,
            schema: {
                model: {
                    id: 'id',
                    fields: {
                        firstname: { type: 'string' },
                        lastname: { type: 'string' },
                        jobtitle: { type: 'string' },
                        company: { type: 'string' },
                        personalemail: { type: 'string' },
                        homephone: { type: 'string' },
                        mobile: { type: 'string' },
                        pob: { type: 'string' },
                        dob: { type: 'date' },
                        ssn: { type: 'string' },
                        address: { type: 'string' },
                        city: { type: 'string' },
                        state: { type: 'string' },
                        zip: { type: 'string' },
                    }
                }
            }    
        });
        $.dsOnboarding = new kendo.data.DataSource({
            transport: {
                read: function (options) {
                    options.success($.model.onboarding)
                },
                create: function (options) {
                    options.success()
                },
                update: function (options) {
                    options.success()
                },
                destroy: function (options) {
                    options.success()
                }
            },
            autoSync: true,
            group: { field: 'status' },
            pageSize: 5000,
            schema: {
                model: {
                    id: 'id',
                    fields: {
                        contractorid: { type: 'number' },
                        biRequest: { type: 'date' },
                        biType: { type: 'string' },
                        interview: { type: 'date' },
                        biSubmitDate: { type: 'date' },
                        sacVerified: { type: 'date' },
                        tmsRequest: { type: 'date' },
                        tmsUserId: { type: 'string' },
                        trainingCompleted: { type: 'date' },
                        domainAccount: { type: 'string' },
                        domainEmail: { type: 'string' },
                        pivRequest: { type: 'date' },
                        pivStatus: { type: 'string' },
                        pivIssuedDate: { type: 'date' },
                        pivExpiration: { type: 'date' },


                        nemaAccount: { type: 'boolean' },
                        eToken: { type: 'boolean' },
                        cag: { type: 'boolean' },
                        comments: { type: 'string' },

                        //not needed
                        status: { type: 'string' },
                        contractPeriod: { type: 'object' },
                    }
                }
            }    

        });
        $.dsGFE = new kendo.data.DataSource({
            transport: {
                read: function (options) {
                    options.success($.model.gfe)
                },
                create: function (options) {
                    options.success()
                },
                update: function (options) {
                    options.success()
                },
                destroy: function (options) {
                    options.success()
                }
            },
            pageSize: 5,
            schema: {
                model: {
                    id: 'id',
                    fields: {
                        makeModel: { type: 'string' },
                        type: { type: 'string' },
                        serialNumber: { type: 'string' },
                        vaBarCode: { type: 'string' },
                        contractorid: { type: 'number' },
                        status: { type: 'string' },
                        value: { type: 'number' },
                        issuingVAMC: { type: 'string' },
                        anticipateReturn: { type: 'date' },
                        physicalLocation: { type: 'string' }
                    }
                }
            }
        });
    }

    $.render = () => {
        $("#toolbar").kendoToolBar({
            items: [
                { template: "<label for='title-dropdown'>Contract: </label>" },
                { template: "<input id='title-dropdown' style='width: 250px;' />", overflow: "never" },
                { type: "separator" },
                { template: "<label for='contractor-dropdown'>Contractor: </label>" },
                { template: "<input id='contractor-dropdown' style='width: 300px;' />", overflow: "never" },
                { type: "separator" },
                { type: "button", text: "View All Contrators", overflow: "never" },
                { template: "<div style='min-width:60vw;'></div>" },
                { type: "button", text: "Companies", overflow: "always" },
                { type: "button", text: "Contracts", overflow: "always" },
                { type: "button", text: "Contractors", overflow: "always" },
                { type: "button", text: "Labor Categories", overflow: "always" },
            ],

            // Events
            click: Events.onToolbarClick
        });

        $('#title-dropdown').kendoDropDownList({
            dataSource: { data: Lookup.contractTitle },
            dataBound: function (e) {
                var allContractPeriods = $.model.contract.map(x => { if (x.title === e.sender.value()) return x.period; });
                console.log(allContractPeriods);

                /*$.dsOnboarding.fetch(() => {
                    $.dsFilters = $.dsOnboarding.filter();
                    $.each(allContractPeriods, (index, value) => {
                        if (index === 0) $.dsFilters.filters.push({ field: 'contractPeriod', operator: 'contains', value: value });
                    });
                });*/
                
            }
        })

        $('#contractor-dropdown').kendoMultiColumnComboBox({
            placeholder: 'Enter Name, LCAT or Select from List...',
            dataTextField: 'lastname',
            dataValueField: 'id',
            optionLabel: 'Select a contractor',
            dataSource: $.model.contractor,
            height: 300,
            columns: [
                { field: 'lastname', title: 'Last Name', width: 200 },
                { field: 'firstname', title: 'First Name', width: 200 },
                { field: 'jobtitle', title: 'Labor Category', width: 400 }
            ],
            filter: 'contains',
            filterFields: ['lastname','firstname','jobtitle'],

            // Events
            change: Events.onToolbarChange
        });

        $('#gridCompany').kendoGrid({
            dataSource: $.dsCompanies,

            // options
            columnMenu:  true,
            editable: 'popup',
            filterable: true,
            pageable: true,
            reorderable: true,
            resizable: true,
            scrollable: { virtual: 'columns' },
            sortable: true,
            toolbar: [ 'create' ],

            columns: [
                { field: 'companyname', title: 'Company Name', width: 250, locked: true },
                { field: 'firstname', title: 'First Name', width: 150, hidden: true },
                { field: 'lastname', title: 'Last Name', width: 150, hidden: true },
                { field: 'contactemail', title: 'Email', width: 250, template: '<a href="mailto:#= contactemail #" title="send mail to #= lastname #, #= firstname #">#= lastname # , #= firstname #</a>' },
                { field: 'contactphone', title: 'Phone', width: 200 },
                { field: 'address', title: 'Address', width: 300 },
                { field: 'city', title: 'City', width: 175 },
                { field: 'state', title: 'State', width: 125 },
                { field: 'zip', title: 'Zip', width: 125 },
                { command: [ 'edit', 'destroy' ], title: ' ', width: 300 }
            ],

            // Events
            edit: (e) => {
                $(e.container).children('div.k-edit-form-container').addClass('wrapper');
                $('div.k-edit-buttons', e.container).detach().appendTo(e.container);
            }
        });

        $('#gridContractor').kendoGrid({
            dataSource: $.dsContractor,

            // options
            columnMenu:  true,
            editable: 'popup',
            filterable: true,
            pageable: true,
            reorderable: true,
            resizable: true,
            scrollable: { virtual: 'columns' },
            sortable: true,
            toolbar: [ 'create' ],

            columns: [
                { field: 'lastname', title: 'Last Name', width: 150, hidden: true },
                { field: 'firstname', title: 'First Name', width: 150, hidden: true },
                { field: 'personalemail', title: 'Email', width: 250, template: '<a href="mailto:#= personalemail #" title="send mail to #= lastname #, #= firstname #">#= lastname # , #= firstname #</a>', locked: true },
                { field: 'company', title: 'Company', width: 250, editor: Editors.companyEditor },
                { field: 'jobtitle', title: 'Labor Category', width: 300, editor: Editors.lcatEditor },
                { field: 'homephone', title: 'Home Phone', width: 175 },
                { field: 'mobile', title: 'Mobile', width: 175 },
                { field: 'pob', title: 'Place of Birth', width: 250 },
                { field: 'dob', title: 'Date of Birth', template: '#= kendo.toString(kendo.parseDate(dob), "M/d/yyyy") #', width: 150 },
                { field: 'ssn', title: 'SSN', width: 150 },
                { field: 'address', title: 'Address', width: 300 },
                { field: 'city', title: 'City', width: 175 },
                { field: 'state', title: 'State', width: 150 },
                { field: 'zip', title: 'Zip', width: 150 },
                { command: [ 'edit', 'destroy' ], title: ' ', width: 300 }
            ],

            // Events
            edit: (e) => {
                $(e.container).children('div.k-edit-form-container').addClass('wrapper');
                $('div.k-edit-buttons', e.container).detach().appendTo(e.container);
            }
        });

        $('#gridLCATs').kendoGrid({
            dataSource: $.dsLCATs,

            // options
            columnMenu:  true,
            editable: 'inline',
            filterable: true,
            pageable: true,
            reorderable: true,
            resizable: true,
            sortable: true,
            toolbar: [ 'create' ],

            columns: [
                { field: 'id', hidden: true },
                { field: 'jobtitle', title: 'Labor Category' },
                { command: [ 'edit', 'destroy' ], title: ' ', width: 300 }
            ],

            // Events
            cancel: function (e) {
                e.sender.cancelChanges()
            }
        })

        $('#gridContracts').kendoGrid({
            dataSource: $.dsContract,

            // options
            columnMenu:  true,
            editable: 'popup',
            filterable: true,
            pageable: true,
            reorderable: true,
            resizable: true,
            //scrollable: { virtual: 'columns' },
            sortable: true,
            toolbar: [ 'create' ],

            columns: [
                { field: 'title', title: 'Contract Name', width: 300, editor: Editors.contractEditor },
                { field: 'corfirst', title: 'Core First Name', width: 200, hidden: true },
                { field: 'corlast', title: 'Core Last Name', width: 200, hidden: true },
                { field: 'coremail', title: 'Core', template: '<a href="mailto: #= coremail #" title="send mail to #= corfirst # #= corlast #">#= corlast #, #= corfirst #</a>', width: 200 },
                { field: 'corphone', title: 'Phone', width: 200 },
                { command: [ 'edit', 'destroy' ], title: ' ', width: 300 }
            ],

            // Events
            detailInit: Events.onContractDetails,
            edit: (e) => {
                $(e.container).children('div.k-edit-form-container').addClass('wrapper');
                $('div.k-edit-buttons', e.container).detach().appendTo(e.container);
            }

        });

        $('#gridOnboarding').kendoGrid({
            dataSource: $.dsOnboarding,

            // options
            columnMenu:  true,
            editable: 'incell',
            filterable: true,
            pageable: false,
            reorderable: false,
            resizable: true,
            scrollable: { virtual: 'columns' },
            sortable: false,
            //toolbar: [ 'create' ],

            columns: [
                { field: 'status', title: 'Status', editor: Editors.status, width: 200 },
                { field: 'contractPeriod', title: 'Contract(s)', template: '#= contractPeriod.join("<br />") #', editor: Editors.contractPeriod, width: 200 },
                { title: 'Background Investigation', 
                    columns: [
                        { field: 'biSubmitDate', title: 'Submit Date', template: '#: kendo.toString(biSubmitDate, "M/d/yyyy") #', width: 150 },
                        { field: 'sacVerified', title: 'SAC Verified', template: '#: kendo.toString(sacVerified, "M/d/yyyy") #', width: 150 },
                        { field: 'biRequest', title: 'Required Date', template: '#: kendo.toString(biRequest, "M/d/yyyy") #', width: 150 },
                        { field: 'biType', title: 'Type', width: 150 },
                        { field: 'interview', title: 'Interview Date', template: '#: kendo.toString(interview, "M/d/yyyy") #', width: 150 },
                    ]
                },
                { title: 'TMS Information',
                    columns: [
                        { field: 'tmsRequest', title: 'Request Date', template: '#: kendo.toString(tmsRequest, "M/d/yyyy") #', width: 150 },
                        { field: 'tmsUserId', title: 'User ID', width: 250 },
                        { field: 'trainingCompleted', title: 'Training Completed', template: '#: kendo.toString(trainingCompleted, "M/d/yyyy") #', width: 150 },
                    ]
                },
                { title: 'Active Directory',
                    columns: [
                        { field: 'domainAccount', title: 'Domain Account', width: 150 },
                        { field: 'domainEmail', title: 'VA Email', width: 250 },
                    ]
                },
                { title: 'PIV Information',
                    columns: [
                        { field: 'pivRequest', title: 'Request Date', template: '#: kendo.toString(pivRequest, "M/d/yyyy") #', width: 150 },
                        { field: 'pivStatus', title: 'Request Status', editor: Editors.pivStatus, width: 150 },
                        { field: 'pivIssuedDate', title: 'Issued Date', template: '#: kendo.toString(pivIssuedDate, "M/d/yyyy") #', width: 150 },
                        { field: 'pivExpiration', title: 'Expiration Date', template: '#: kendo.toString(pivExpiration, "M/d/yyyy") #', width: 150 },
                    ]
                },
                { title: 'Elevated Permissions',
                    columns: [
                        { field: 'nemaAccount', title: 'NEMA Account', template: '#= nemaAccount ? "Yes" : "No" #', width: 150 },
                        { field: 'eToken', title: 'eToken Issued', template: '#= eToken ? "Yes" : "No" #', width: 150 },
                    ]
                },
                { title: 'Remote Access',
                    columns: [
                        { field: 'cag', title: 'CAG', template: '#= cag ? "Yes" : "No" #', width: 150 },
                    ]
                }
            ],

            // Events
            detailInit: Events.onOnboardingInit,
            dataBound: function() { this.expandRow(this.tbody.find('tr.k-master-row').first()); }
        });

        $('#gridGFE').kendoGrid({
            dataSource: $.dsGFE,

            // options
            columnMenu:  false,
            editable: 'popup',
            filterable: false,
            pageable: true,
            reorderable: false,
            resizable: true,
            scrollable: { virtual: 'columns' },
            sortable: false,
            toolbar: [ 'create' ],

            columns: [
                { field: 'id', hidden: true },
                { field: 'contractorid', hidden: true },
                { field: 'status', title: 'Status', editor: Editors.gfeStatus, width: 200 },
                { field: 'type', title: 'Equipment Type', editor: Editors.gfeType, width: 200 },
                { field: 'makeModel', title: 'Make & Model', width: 200 },
                { field: 'serialNumber', title: 'Serial Number', width: 150 },
                { field: 'vaBarCode', title: 'VA Barcode', width: 150 },
                { field: 'value', title: 'Retail Value', format: '{0:c2}', width: 150 },
                { field: 'issuingVAMC', title: 'Issued By', width: 200 },
                { field: 'anticipateReturn', title: 'Return Date', template: '#: kendo.toString(anticipateReturn, "M/d/yyyy") #', width: 150 },
                { field: 'physicalLocation', title: 'Physical Location', width: 200 },
                { command: [ 'edit', 'destroy' ], title: ' ', width: 300 }
            ],

            // Events
            save: function (e) { console.log(e); }
        });

        $('#gridQuickView').kendoGrid({
            dataSource: $.dsOnboarding,
            
            // options
            columnMenu:  true,
            filterable: true,
            groupable: true,
            pageable: {
                buttonCount: 3,
                pageSize: 10,
                pageSizes: true
            },
            reorderable: true,
            resizable: true,
            selectable: true,
            sortable: true,
            toolbar: [ 'search' ],

            columns: [
                { field: 'contractorid', title: 'Contractor', template: function (dataItem) {
                    var item = $.dsContractor.data()[parseInt(dataItem.contractorid)];
                    return item.lastname + ', ' + item.firstname;
                } },
                { field: 'contractorid', title: 'Labor Category', template: function (dataItem) {
                    var item = $.dsContractor.data()[parseInt(dataItem.contractorid)];
                    return item.jobtitle;
                } },
                { field: 'contractorid', title: 'Company', template: function (dataItem) {
                    var item = $.dsContractor.data()[parseInt(dataItem.contractorid)];
                    return item.company;
                } }
            ],

            // Events
            change: Events.onQuickViewSelect,
            dataBound: function (e) {
                var grid = this;
                $(".k-grouping-row").each(function (e) {
                    grid.collapseGroup(this);
                });
            }
        });
    }

    Events = {
        onContractDetails: (e) => {
            console.log(e.data.id);
            $.dsContractPeriod.filter({ field: 'contractid', operator: 'eq', value: e.data.id });
            $('<div/>').appendTo(e.detailCell).kendoGrid({
                dataSource: $.dsContractPeriod,
                editable: 'inline',
                sortable: true,
                toolbar: [ 'create' ],
                columns: [
                    { field: 'period', title: 'Contract Period', width: 175, editor: Editors.period },
                    { field: 'startdate', title: 'Start Date', template: '#= kendo.toString(kendo.parseDate(startdate), "MMM d, yyyy") #', width: 175 },
                    { field: 'enddate', title: 'End Date', template: '#= kendo.toString(kendo.parseDate(enddate), "MMM d, yyyy") #', width: 175 },
                    { field: 'eps', title: 'EPS Number', width: 250 },
                    { field: 'cnumber', title: 'Contract Number', width: 250 },
                    { command: [ 'edit', 'destroy' ], title: ' ', width: 300 }
                ]
            });
        },
        onToolbarChange: (e) => {
            $('#content').children('div :not(:first)').hide();
            $('#content').children('div :first').show();

            $('#gridOnboarding').data('kendoGrid').dataSource.filter({
                field: 'contractorid',
                operator: 'eq',
                value: parseInt(e.sender.value())
            });

            $.dsGFE.filter({ 
                field: 'contractorid', 
                operator: 'eq', 
                value: parseInt(e.sender.value())
            });

            $('#details').show();
            $('#gridQuickView').hide();  

            $.dsOnboarding.group([]);          
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
                case 'Contractors':
                    $($('#content').children('div')[3]).show();
                    break;
                case 'Labor Categories':
                    $($('#content').children('div')[4]).show();
                    break;
                case 'View All Contrators':
                    $('#content').children('div :first').show();
                    $.dsOnboarding.filter({});
                    $.dsOnboarding.group({ field: 'status' });
                    $('#details').hide();
                    $('#gridQuickView').show();
                    break;
                default:
                    // no default behavior
            }

            $('#contractor-dropdown').data('kendoMultiColumnComboBox').value('');
        },
        onCompanyEdit: (e) => {
            e.container.find('label[for="id"]').parent().hide();
            e.container.find('div[data-container-for="id"]').hide();
        },
        onContractorEdit: (e) => {
            e.container.find('label[for="id"]').parent().hide();
            e.container.find('div[data-container-for="id"]').hide();
        },
        onContractEdit: (e) => {
            e.container.find('label[for="id"]').parent().hide();
            e.container.find('div[data-container-for="id"]').hide();
        },
        onOnboardingInit: (e) => {
            $('<div style="width: 80vw;"/>').appendTo(e.detailCell).kendoGrid({
                dataSource: { data: [e.data] },
                editable: 'incell',
                columns: [
                    {
                        field: 'comments',
                        title: 'Comments',
                        template: '#= comments #',
                        editor: function (container, options) {
                            $('<textarea data-bind="value:comments"></textarea>').appendTo(container).kendoEditor();
                        }
                    }
                ]
            });
        },
        onQuickViewSelect: (e) => {
            var id = e.sender.dataItem(e.sender.select()).id;
            $.dsOnboarding.group([]);

            $.dsOnboarding.filter({
                field: 'contractorid',
                operator: 'eq',
                value: id
            });

            var ddToolbar = $('#contractor-dropdown').data('kendoMultiColumnComboBox');
            ddToolbar.select(id);

            $('#details').show();
            $('#gridQuickView').hide(); 

            $.dsGFE.filter({ 
                field: 'contractorid', 
                operator: 'eq', 
                value: id
            });
        }
    }

    Editors = {
        contractEditor: (container, options) => {
            $('<input required name="' + options.field + '"/>')
            .appendTo(container)
            .kendoDropDownList({
                autoBind: true,
                dataSource: { data: Lookup.contracts }
            });
        },
        companyEditor: (container, options) => {
            $('<input required name="' + options.field + '"/>')
            .appendTo(container)
            .kendoDropDownList({
                autoBind: false,
                dataTextField: 'companyname',
                dataValueField: 'companyname',
                dataSource: $.dsCompanies
            });
        },
        lcatEditor: (container, options) => {
            $('<input required name="' + options.field + '"/>')
            .appendTo(container)
            .kendoDropDownList({
                autoBind: false,
                dataTextField: 'jobtitle',
                dataValueField: 'jobtitle',
                dataSource: { data: $.model.lcat }
            });
        },
        period: (container, options) => {
            $('<input required name="' + options.field + '"/>')
            .appendTo(container)
            .kendoDropDownList({
                autoBind: true,
                dataSource: { data: Lookup.period }
            });
        },
        status: (container, options) => {
            $('<input required name="' + options.field + '"/>')
            .appendTo(container)
            .kendoDropDownList({
                autoBind: false,
                dataSource: { data: Lookup.workstatus }
            });
        },
        pivStatus: (container, options) => {
            $('<input required name="' + options.field + '"/>')
            .appendTo(container)
            .kendoDropDownList({
                autoBind: false,
                dataSource: { data: Lookup.status }
            });
        },
        contractPeriod: (container, options) => {
            $('<select multiple="multiple" data-bind="value:contractPeriod"/>')
            .appendTo(container)
            .kendoMultiSelect({
                dataSource: Lookup.period
            });
        },
        gfeStatus: (container, options) => {
            $('<input required name="' + options.field + '"/>')
            .appendTo(container)
            .kendoDropDownList({
                autoBind: false,
                dataSource: { data: Lookup.equipmentStatus }
            });
        },
        gfeType: (container, options) => {
            $('<input required name="' + options.field + '"/>')
            .appendTo(container)
            .kendoDropDownList({
                autoBind: false,
                dataSource: { data: Lookup.equipmentType }
            });
        }
    }
} (window.vaApp = window.vaApp = window.$ || {}, jQuery));

$.init();
$.render();

$('#content').children('div :not(:first)').hide();
$('#details').hide();
