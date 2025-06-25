
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase'
import { useClinicAuth } from '@/hooks/useClinicAuth'
import { Package, AlertTriangle, Plus, TrendingDown, TrendingUp } from 'lucide-react'
import type { InventoryCategory } from '@/types/database'

interface InventoryItem {
  id: string
  name: string
  category: InventoryCategory
  current_stock: number
  minimum_stock: number
  unit_price?: number
  supplier?: string
  last_restocked?: string
  created_at: string
}

export const InventoryManagement: React.FC = () => {
  const { clinicUser } = useClinicAuth()
  const { toast } = useToast()
  const [items, setItems] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [newItem, setNewItem] = useState({
    name: '',
    category: 'contact_lenses' as InventoryCategory,
    current_stock: 0,
    minimum_stock: 0,
    unit_price: 0,
    supplier: ''
  })

  useEffect(() => {
    fetchInventoryItems()
  }, [clinicUser])

  const fetchInventoryItems = async () => {
    if (!clinicUser?.clinic_id) return

    try {
      const { data, error } = await supabase
        .from('inventory_items')
        .select('*')
        .eq('clinic_id', clinicUser.clinic_id)
        .order('name')

      if (error) throw error
      setItems(data || [])
    } catch (error) {
      console.error('Error fetching inventory:', error)
    } finally {
      setLoading(false)
    }
  }

  const addInventoryItem = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!clinicUser?.clinic_id) return

    try {
      const { error } = await supabase
        .from('inventory_items')
        .insert({
          clinic_id: clinicUser.clinic_id,
          ...newItem,
          last_restocked: new Date().toISOString()
        })

      if (error) throw error

      toast({
        title: "Item Added",
        description: "Inventory item has been added successfully.",
      })

      setNewItem({
        name: '',
        category: 'contact_lenses',
        current_stock: 0,
        minimum_stock: 0,
        unit_price: 0,
        supplier: ''
      })

      fetchInventoryItems()
    } catch (error: any) {
      toast({
        title: "Failed to Add Item",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const updateStock = async (itemId: string, newStock: number) => {
    try {
      const { error } = await supabase
        .from('inventory_items')
        .update({ 
          current_stock: newStock,
          last_restocked: new Date().toISOString()
        })
        .eq('id', itemId)

      if (error) throw error

      toast({
        title: "Stock Updated",
        description: "Inventory has been updated successfully.",
      })

      fetchInventoryItems()
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const getStockStatus = (current: number, minimum: number) => {
    if (current === 0) return { status: 'out', color: 'bg-red-100 text-red-800', icon: <AlertTriangle className="h-3 w-3" /> }
    if (current <= minimum) return { status: 'low', color: 'bg-yellow-100 text-yellow-800', icon: <TrendingDown className="h-3 w-3" /> }
    return { status: 'good', color: 'bg-green-100 text-green-800', icon: <TrendingUp className="h-3 w-3" /> }
  }

  const getCategoryIcon = (category: InventoryCategory) => {
    return <Package className="h-4 w-4" />
  }

  const lowStockItems = items.filter(item => item.current_stock <= item.minimum_stock)

  if (loading) {
    return <div className="flex justify-center items-center p-8">Loading...</div>
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{items.length}</div>
                <div className="text-sm text-muted-foreground">Total Items</div>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-red-600">{lowStockItems.length}</div>
                <div className="text-sm text-muted-foreground">Low Stock</div>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {items.filter(i => i.current_stock > i.minimum_stock).length}
                </div>
                <div className="text-sm text-muted-foreground">Well Stocked</div>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">
                  ${items.reduce((sum, item) => sum + (item.current_stock * (item.unit_price || 0)), 0).toFixed(0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Value</div>
              </div>
              <Package className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            {lowStockItems.length} item(s) are running low on stock and need restocking.
          </AlertDescription>
        </Alert>
      )}

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Inventory Management
              </CardTitle>
              <CardDescription>
                Track and manage your clinic's medical supplies and equipment
              </CardDescription>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Item
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Inventory Item</DialogTitle>
                  <DialogDescription>
                    Add a new item to your clinic's inventory
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={addInventoryItem} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="item-name">Item Name</Label>
                    <Input
                      id="item-name"
                      value={newItem.name}
                      onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={newItem.category} onValueChange={(value) => setNewItem({...newItem, category: value as InventoryCategory})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="contact_lenses">Contact Lenses</SelectItem>
                        <SelectItem value="eyeglasses">Eyeglasses</SelectItem>
                        <SelectItem value="medicines">Medicines</SelectItem>
                        <SelectItem value="equipment">Equipment</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-stock">Current Stock</Label>
                      <Input
                        id="current-stock"
                        type="number"
                        value={newItem.current_stock}
                        onChange={(e) => setNewItem({...newItem, current_stock: parseInt(e.target.value) || 0})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="minimum-stock">Minimum Stock</Label>
                      <Input
                        id="minimum-stock"
                        type="number"
                        value={newItem.minimum_stock}
                        onChange={(e) => setNewItem({...newItem, minimum_stock: parseInt(e.target.value) || 0})}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="unit-price">Unit Price ($)</Label>
                      <Input
                        id="unit-price"
                        type="number"
                        step="0.01"
                        value={newItem.unit_price}
                        onChange={(e) => setNewItem({...newItem, unit_price: parseFloat(e.target.value) || 0})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="supplier">Supplier</Label>
                      <Input
                        id="supplier"
                        value={newItem.supplier}
                        onChange={(e) => setNewItem({...newItem, supplier: e.target.value})}
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full">Add Item</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Min Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Unit Price</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => {
                const stockStatus = getStockStatus(item.current_stock, item.minimum_stock)
                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(item.category)}
                        {item.category.replace('_', ' ').toUpperCase()}
                      </div>
                    </TableCell>
                    <TableCell>{item.current_stock}</TableCell>
                    <TableCell>{item.minimum_stock}</TableCell>
                    <TableCell>
                      <Badge className={`${stockStatus.color} flex items-center gap-1 w-fit`}>
                        {stockStatus.icon}
                        {stockStatus.status.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>${item.unit_price?.toFixed(2) || '0.00'}</TableCell>
                    <TableCell>{item.supplier || '-'}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          className="w-20"
                          defaultValue={item.current_stock}
                          onBlur={(e) => {
                            const newStock = parseInt(e.target.value) || 0
                            if (newStock !== item.current_stock) {
                              updateStock(item.id, newStock)
                            }
                          }}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
