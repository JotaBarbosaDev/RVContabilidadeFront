                  
                  {/* Coluna Esquerda */}
                  <div className="space-y-6">
                    
                    {/* 👤 Dados Pessoais */}
                    <Card className="shadow-sm">
                      <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-lg">
                        <CardTitle className="flex items-center space-x-2 text-lg text-blue-800">
                          <User className="h-5 w-5" />
                          <span>👤 Dados Pessoais</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4 space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-600">Nome</label>
                            {isEditMode ? (
                              <Input
                                value={profileFormData.name}
                                onChange={(e) => setProfileFormData(prev => ({ ...prev, name: e.target.value }))}
                                className="mt-1"
                              />
                            ) : (
                              <p className="mt-1 text-gray-900 font-medium">{selectedClient.name}</p>
                            )}
                          </div>
                          
                          <div>
                            <label className="text-sm font-medium text-gray-600">Email</label>
                            {isEditMode ? (
                              <Input
                                type="email"
                                value={profileFormData.email}
                                onChange={(e) => setProfileFormData(prev => ({ ...prev, email: e.target.value }))}
                                className="mt-1"
                              />
                            ) : (
                              <p className="mt-1 text-gray-900 font-medium">{selectedClient.email}</p>
                            )}
                          </div>
                          
                          <div>
                            <label className="text-sm font-medium text-gray-600">Telefone</label>
                            {isEditMode ? (
                              <Input
                                value={profileFormData.phone}
                                onChange={(e) => setProfileFormData(prev => ({ ...prev, phone: e.target.value }))}
                                className="mt-1"
                              />
                            ) : (
                              <p className="mt-1 text-gray-900 font-medium">{selectedClient.phone}</p>
                            )}
                          </div>
                          
                          <div>
                            <label className="text-sm font-medium text-gray-600">NIF</label>
                            {isEditMode ? (
                              <Input
                                value={profileFormData.nif}
                                onChange={(e) => setProfileFormData(prev => ({ ...prev, nif: e.target.value }))}
                                className="mt-1"
                              />
                            ) : (
                              <p className="mt-1 text-gray-900 font-medium">{selectedClient.nif}</p>
                            )}
                          </div>
                          
                          <div>
                            <label className="text-sm font-medium text-gray-600">Data de Nascimento</label>
                            {isEditMode ? (
                              <Input
                                type="date"
                                value={profileFormData.date_of_birth}
                                onChange={(e) => setProfileFormData(prev => ({ ...prev, date_of_birth: e.target.value }))}
                                className="mt-1"
                              />
                            ) : (
                              <p className="mt-1 text-gray-900 font-medium">
                                {selectedClient.date_of_birth ? new Date(selectedClient.date_of_birth).toLocaleDateString('pt-PT') : 'Não informado'}
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* 🏠 Morada Fiscal */}
                    <Card className="shadow-sm">
                      <CardHeader className="pb-4 bg-gradient-to-r from-green-50 to-green-100 rounded-t-lg">
                        <CardTitle className="flex items-center space-x-2 text-lg text-green-800">
                          <MapPin className="h-5 w-5" />
                          <span>🏠 Morada Fiscal</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4 space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-600">Endereço</label>
                          {isEditMode ? (
                            <Input
                              value={profileFormData.fiscal_address || profileFormData.address}
                              onChange={(e) => setProfileFormData(prev => ({ ...prev, fiscal_address: e.target.value }))}
                              className="mt-1"
                            />
                          ) : (
                            <p className="mt-1 text-gray-900 font-medium">
                              {selectedClient.fiscal_address || selectedClient.address || 'Não informado'}
                            </p>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-600">Código Postal</label>
                            {isEditMode ? (
                              <Input
                                value={profileFormData.fiscal_postal_code || profileFormData.postal_code}
                                onChange={(e) => setProfileFormData(prev => ({ ...prev, fiscal_postal_code: e.target.value }))}
                                className="mt-1"
                              />
                            ) : (
                              <p className="mt-1 text-gray-900 font-medium">
                                {selectedClient.fiscal_postal_code || selectedClient.postal_code || 'Não informado'}
                              </p>
                            )}
                          </div>
                          
                          <div>
                            <label className="text-sm font-medium text-gray-600">Cidade</label>
                            {isEditMode ? (
                              <Input
                                value={profileFormData.fiscal_city || profileFormData.city}
                                onChange={(e) => setProfileFormData(prev => ({ ...prev, fiscal_city: e.target.value }))}
                                className="mt-1"
                              />
                            ) : (
                              <p className="mt-1 text-gray-900 font-medium">
                                {selectedClient.fiscal_city || selectedClient.city || 'Não informado'}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-gray-600">Tipo de Cliente</label>
                          <p className="mt-1 text-gray-900 font-medium">
                            {selectedClient.has_company || selectedClient.company_name ? 'Empresarial' : 'Particular'}
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* 🏢 Dados da Empresa */}
                    {(selectedClient.has_company || selectedClient.company_name || isEditMode) && (
                      <Card className="shadow-sm">
                        <CardHeader className="pb-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-t-lg">
                          <CardTitle className="flex items-center space-x-2 text-lg text-purple-800">
                            <Building className="h-5 w-5" />
                            <span>🏢 Dados da Empresa</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-4">
                          <div>
                            <label className="text-sm font-medium text-gray-600">Nome</label>
                            {isEditMode ? (
                              <Input
                                value={profileFormData.company_name}
                                onChange={(e) => setProfileFormData(prev => ({ ...prev, company_name: e.target.value }))}
                                className="mt-1"
                              />
                            ) : (
                              <p className="mt-1 text-gray-900 font-medium">{selectedClient.company_name || 'Não informado'}</p>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium text-gray-600">NIPC</label>
                              {isEditMode ? (
                                <Input
                                  value={profileFormData.nipc}
                                  onChange={(e) => setProfileFormData(prev => ({ ...prev, nipc: e.target.value }))}
                                  className="mt-1"
                                />
                              ) : (
                                <p className="mt-1 text-gray-900 font-medium">{selectedClient.nipc || 'Não informado'}</p>
                              )}
                            </div>
                            
                            <div>
                              <label className="text-sm font-medium text-gray-600">CAE</label>
                              {isEditMode ? (
                                <Input
                                  value={profileFormData.cae}
                                  onChange={(e) => setProfileFormData(prev => ({ ...prev, cae: e.target.value }))}
                                  className="mt-1"
                                />
                              ) : (
                                <p className="mt-1 text-gray-900 font-medium">{selectedClient.cae || 'Não informado'}</p>
                              )}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium text-gray-600">Forma Jurídica</label>
                              {isEditMode ? (
                                <Select value={profileFormData.legal_form} onValueChange={(value) => setProfileFormData(prev => ({ ...prev, legal_form: value }))}>
                                  <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Selecionar" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="unipessoal">Unipessoal</SelectItem>
                                    <SelectItem value="lda">Limitada</SelectItem>
                                    <SelectItem value="sa">Sociedade Anónima</SelectItem>
                                    <SelectItem value="individual">Individual</SelectItem>
                                  </SelectContent>
                                </Select>
                              ) : (
                                <p className="mt-1 text-gray-900 font-medium">{selectedClient.legal_form || 'Não informado'}</p>
                              )}
                            </div>
                            
                            <div>
                              <label className="text-sm font-medium text-gray-600">Data de Constituição</label>
                              {isEditMode ? (
                                <Input
                                  type="date"
                                  value={profileFormData.founding_date}
                                  onChange={(e) => setProfileFormData(prev => ({ ...prev, founding_date: e.target.value }))}
                                  className="mt-1"
                                />
                              ) : (
                                <p className="mt-1 text-gray-900 font-medium">
                                  {selectedClient.founding_date ? new Date(selectedClient.founding_date).toLocaleDateString('pt-PT') : 'Não informado'}
                                </p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>

                  {/* Coluna Direita */}
                  <div className="space-y-6">
                    
                    {/* 📊 Atividade Empresarial */}
                    <Card className="shadow-sm">
                      <CardHeader className="pb-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-t-lg">
                        <CardTitle className="flex items-center space-x-2 text-lg text-orange-800">
                          <FileText className="h-5 w-5" />
                          <span>📊 Atividade Empresarial</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4 space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-600">Atividade</label>
                          {isEditMode ? (
                            <Textarea
                              value={profileFormData.business_activity}
                              onChange={(e) => setProfileFormData(prev => ({ ...prev, business_activity: e.target.value }))}
                              className="mt-1"
                              rows={3}
                            />
                          ) : (
                            <p className="mt-1 text-gray-900 font-medium">{selectedClient.business_activity || 'Não informado'}</p>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-600">Faturação Estimada</label>
                            {isEditMode ? (
                              <div className="mt-1 relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">€</span>
                                <Input
                                  type="number"
                                  value={profileFormData.estimated_revenue}
                                  onChange={(e) => setProfileFormData(prev => ({ ...prev, estimated_revenue: Number(e.target.value) }))}
                                  className="pl-8"
                                />
                              </div>
                            ) : (
                              <p className="mt-1 text-gray-900 font-medium">
                                €{selectedClient.estimated_revenue?.toLocaleString('pt-PT') || '0'}
                              </p>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium text-gray-600">Faturas/Mês</label>
                              {isEditMode ? (
                                <Input
                                  type="number"
                                  value={profileFormData.monthly_invoices}
                                  onChange={(e) => setProfileFormData(prev => ({ ...prev, monthly_invoices: Number(e.target.value) }))}
                                  className="mt-1"
                                />
                              ) : (
                                <p className="mt-1 text-gray-900 font-medium">{selectedClient.monthly_invoices || '0'}</p>
                              )}
                            </div>
                            
                            <div>
                              <label className="text-sm font-medium text-gray-600">Funcionários</label>
                              {isEditMode ? (
                                <Input
                                  type="number"
                                  value={profileFormData.number_employees}
                                  onChange={(e) => setProfileFormData(prev => ({ ...prev, number_employees: Number(e.target.value) }))}
                                  className="mt-1"
                                />
                              ) : (
                                <p className="mt-1 text-gray-900 font-medium">{selectedClient.number_employees || '0'}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* ⚙️ Regimes Fiscais */}
                    <Card className="shadow-sm">
                      <CardHeader className="pb-4 bg-gradient-to-r from-teal-50 to-teal-100 rounded-t-lg">
                        <CardTitle className="flex items-center space-x-2 text-lg text-teal-800">
                          <CreditCard className="h-5 w-5" />
                          <span>⚙️ Regimes Fiscais</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4 space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-600">Contabilidade</label>
                          {isEditMode ? (
                            <Select value={profileFormData.accounting_regime} onValueChange={(value) => setProfileFormData(prev => ({ ...prev, accounting_regime: value }))}>
                              <SelectTrigger className="mt-1">
                                <SelectValue placeholder="Selecionar" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="organizada">Organizada</SelectItem>  
                                <SelectItem value="simplificada">Simplificada</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            <p className="mt-1 text-gray-900 font-medium">{selectedClient.accounting_regime || 'Não informado'}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-gray-600">IVA</label>
                          {isEditMode ? (
                            <Select value={profileFormData.vat_regime} onValueChange={(value) => setProfileFormData(prev => ({ ...prev, vat_regime: value }))}>
                              <SelectTrigger className="mt-1">
                                <SelectValue placeholder="Selecionar" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="normal">Normal</SelectItem>
                                <SelectItem value="isento_art53">Isento Art. 53º</SelectItem>
                                <SelectItem value="pequenos_retalhistas">Pequenos Retalhistas</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            <p className="mt-1 text-gray-900 font-medium">{selectedClient.vat_regime || 'Não informado'}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-gray-600">Relatórios</label>
                          {isEditMode ? (
                            <Select value={profileFormData.report_frequency} onValueChange={(value) => setProfileFormData(prev => ({ ...prev, report_frequency: value }))}>
                              <SelectTrigger className="mt-1">
                                <SelectValue placeholder="Selecionar" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="mensal">Mensal</SelectItem>
                                <SelectItem value="trimestral">Trimestral</SelectItem>
                                <SelectItem value="semestral">Semestral</SelectItem>
                                <SelectItem value="anual">Anual</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            <p className="mt-1 text-gray-900 font-medium">{selectedClient.report_frequency || 'Não informado'}</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {/* 🔐 Credenciais */}
                    <Card className="shadow-sm">
                      <CardHeader className="pb-4 bg-gradient-to-r from-red-50 to-red-100 rounded-t-lg">
                        <CardTitle className="flex items-center space-x-2 text-lg text-red-800">
                          <Lock className="h-5 w-5" />
                          <span>🔐 Credenciais</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4 space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-600">Username</label>
                          {isEditMode ? (
                            <Input
                              value={profileFormData.username}
                              onChange={(e) => setProfileFormData(prev => ({ ...prev, username: e.target.value }))}
                              className="mt-1"
                            />
                          ) : (
                            <p className="mt-1 text-gray-900 font-medium">{selectedClient.username || 'Não informado'}</p>
                          )}
                        </div>
                        
                        {isEditMode && (
                          <>
                            <div>
                              <label className="text-sm font-medium text-gray-600">Nova Password (opcional)</label>
                              <Input
                                type="password"
                                value={profileFormData.new_password}
                                onChange={(e) => setProfileFormData(prev => ({ ...prev, new_password: e.target.value }))}
                                className="mt-1"
                                placeholder="Deixar vazio para manter atual"
                              />
                            </div>
                            
                            <div>
                              <label className="text-sm font-medium text-gray-600">Confirmar Nova Password</label>
                              <Input
                                type="password"
                                value={profileFormData.confirm_password}
                                onChange={(e) => setProfileFormData(prev => ({ ...prev, confirm_password: e.target.value }))}
                                className="mt-1"
                                placeholder="Confirmar apenas se alterar password"
                              />
                            </div>
                          </>
                        )}
                        
                        {!isEditMode && (
                          <div>
                            <label className="text-sm font-medium text-gray-600">Password</label>
                            <p className="mt-1 text-gray-900 font-medium">••••••••</p>
                          </div>
                        )}
                        
                        <div>
                          <label className="text-sm font-medium text-gray-600">Status da Conta</label>
                          {isEditMode ? (
                            <Select value={profileFormData.status} onValueChange={(value: 'approved' | 'pending' | 'rejected' | 'blocked') => setProfileFormData(prev => ({ ...prev, status: value }))}>
                              <SelectTrigger className="mt-1">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="approved">Aprovado</SelectItem>
                                <SelectItem value="pending">Pendente</SelectItem>
                                <SelectItem value="rejected">Rejeitado</SelectItem>
                                <SelectItem value="blocked">Bloqueado</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            <div className="mt-1">
                              {getStatusBadge(selectedClient.status)}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
